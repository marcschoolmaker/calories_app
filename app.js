// =========================
//  JS: FORM VALIDATION
// =========================
const form = document.getElementById('macro-form');
const calcBtn = document.getElementById('calc-btn');
const resultSection = document.getElementById('result-section');
const inputCard = document.getElementById('input-card');

// Input fields
const fields = {
  weight:    { el: document.getElementById('weight'),    min: 30,   max: 500,   required: true },
  bodyfat:   { el: document.getElementById('bodyfat'),   min: 5,    max: 60,    required: true },
  activity:  { el: document.getElementById('activity'),  required: true },
  surplus:   { el: document.getElementById('surplus'),   min: 5,    max: 15,    required: true },
  deficit:   { el: document.getElementById('deficit'),   min: 10,   max: 30,    required: true },
  protein:   { el: document.getElementById('protein'),   min: 1.5,  max: 2.5,   required: true },
  fat:       { el: document.getElementById('fat'),       min: 0.7,  max: 1.2,   required: true },
};

// Error elements
const errors = {
  weight:  document.getElementById('weight-error'),
  bodyfat: document.getElementById('bodyfat-error'),
  activity:document.getElementById('activity-error'),
  surplus: document.getElementById('surplus-error'),
  deficit: document.getElementById('deficit-error'),
  protein: document.getElementById('protein-error'),
  fat:     document.getElementById('fat-error'),
};

// Validate a single field
function validateField(key) {
  const { el, min, max, required } = fields[key];
  const val = el.value.trim();
  let err = '';
  if (required && val === '') {
    err = 'Champ requis';
  } else if (key !== 'activity') {
    let num = parseFloat(val);
    if (isNaN(num)) {
      err = 'Entrée invalide';
    } else if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
      err = `Doit être compris entre ${min} et ${max}`;
    }
  }
  errors[key].textContent = err;
  return !err;
}

// Validate all fields, return if form is valid
function validateForm(showAllErrors = false) {
  let valid = true;
  for (const key in fields) {
    const isValid = validateField(key);
    if (!isValid) valid = false;
    if (!showAllErrors && (key === 'weight' || key === 'bodyfat' || key === 'activity')) {
      // Only show errors for required fields on input
      errors[key].textContent = errors[key].textContent;
    }
  }
  // Enable button only if required fields are valid
  const reqValid = ['weight','bodyfat','activity'].every(k => validateField(k));
  calcBtn.disabled = !reqValid;
  return valid;
}

// Attach input listeners
Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('input', () => validateForm(false));
});

// =========================
//  JS: CALCULATION LOGIC
// =========================
function round5(x) {
  return Math.round(x / 5) * 5;
}
function calcMacros({weight, bodyfat, activity, surplus, deficit, protein, fat}) {
  // Defensive parse
  weight = parseFloat(weight);
  bodyfat = parseFloat(bodyfat);
  activity = parseFloat(activity); // select value
  surplus = parseFloat(surplus);
  deficit = parseFloat(deficit);
  protein = parseFloat(protein);
  fat = parseFloat(fat);
  if ([weight, bodyfat, activity, surplus, deficit, protein, fat].some(isNaN)) return null;
  const leanMass = weight * (1 - bodyfat/100);
  const BMR = 370 + 21.6 * leanMass;
  const maintenance = BMR * activity;
  const bulkCals = maintenance * (1 + surplus/100);
  const cutCals = maintenance * (1 - deficit/100);
  const protG = protein * leanMass;
  const fatG = fat * leanMass;
  function macroRow(goal, cal) {
    const protKcal = protG * 4;
    const fatKcal = fatG * 9;
    const carbKcal = cal - protKcal - fatKcal;
    const carbG = carbKcal / 4;
    // Traduction des objectifs
    let objectif = goal;
    if (goal === 'Maintenance') objectif = 'Maintien';
    if (goal === 'Cut') objectif = 'Sèche';
    if (goal === 'Bulk') objectif = 'Prise de masse';
    return {
      goal: objectif,
      calories: Math.round(cal),
      protein: round5(protG),
      carbs: round5(carbG > 0 ? carbG : 0),
      fat: round5(fatG)
    };
  }
  return [
    macroRow('Maintenance', maintenance),
    macroRow('Cut', cutCals),
    macroRow('Bulk', bulkCals)
  ];
}

// =========================
//  JS: FORM SUBMIT & OUTPUT
// =========================
form.addEventListener('submit', function(e) {
  e.preventDefault();
  // Validate all fields and show errors
  const valid = validateForm(true);
  if (!valid) {
    // Shake card
    inputCard.classList.remove('shake');
    void inputCard.offsetWidth; // force reflow
    inputCard.classList.add('shake');
    return;
  }
  // Gather values
  const values = {};
  for (const key in fields) {
    values[key] = fields[key].el.value;
  }
  const result = calcMacros(values);
  if (!result) return;
  // Render result
  renderResult(result);
});

// Render result card
function renderResult(rows) {
  resultSection.innerHTML = `
    <div class="result-card">
      <table class="result-table">
        <thead>
          <tr>
            <th>Objectif</th>
            <th>Calories</th>
            <th>Protéines (g)</th>
            <th>Glucides (g)</th>
            <th>Lipides (g)</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${r.goal}</td>
              <td>${r.calories}</td>
              <td>${r.protein}</td>
              <td>${r.carbs}</td>
              <td>${r.fat}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="result-note">Macros arrondis au multiple de 5 g pour simplifier.</div>
    </div>
  `;
} 
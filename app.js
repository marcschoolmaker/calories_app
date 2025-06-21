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

// =========================
//  JS: MODALE TAUX DE GRAISSE
// =========================
const openBodyfatBtn = document.getElementById('open-bodyfat-modal');
const bodyfatModal = document.getElementById('bodyfat-modal');
const closeBodyfatBtn = document.getElementById('close-bodyfat-modal');
const validateBodyfatBtn = document.getElementById('validate-bodyfat');
const bodyfatInput = document.getElementById('bodyfat');
const femmeGrid = document.getElementById('bodyfat-images-femme');
const hommeGrid = document.getElementById('bodyfat-images-homme');
const genderRadios = document.querySelectorAll('input[name="gender"]');
const bodyfatSelectArea = document.getElementById('bodyfat-select-area');

let selectedBodyfat = null;
let selectedGender = 'femme';

function showBodyfatValueDisplay(value) {
  // Toujours utiliser la valeur du champ caché si value n'est pas valide
  const displayValue = (!value || isNaN(Number(value))) ? bodyfatInput.value : value;
  if (!displayValue || isNaN(Number(displayValue))) {
    showBodyfatButton();
    return;
  }
  bodyfatSelectArea.innerHTML = `
    <div class="bodyfat-value-display">
      <span>Taux de graisse : <strong>${displayValue}%</strong></span>
      <button type="button" class="edit-bodyfat-btn" id="edit-bodyfat-btn" title="Modifier">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.25 8.25a2 2 0 0 1-.878.513l-3.036.867a.5.5 0 0 1-.62-.62l.867-3.036a2 2 0 0 1 .513-.878l8.25-8.25ZM15 2a4 4 0 0 0-2.828 1.172l-8.25 8.25a4 4 0 0 0-1.027 1.756l-.867 3.036A2 2 0 0 0 3.786 18.1l3.036-.867a4 4 0 0 0 1.756-1.027l8.25-8.25A4 4 0 0 0 15 2Z" fill="currentColor"/></svg>
      </button>
    </div>
  `;
  document.getElementById('edit-bodyfat-btn').addEventListener('click', () => {
    openBodyfatModal();
  });
}
function showBodyfatButton() {
  bodyfatSelectArea.innerHTML = `<button type="button" id="open-bodyfat-modal" class="secondary-btn" style="width:100%;">Définir mon taux de graisse</button>`;
  document.getElementById('open-bodyfat-modal').addEventListener('click', openBodyfatModal);
}
function openBodyfatModal() {
  bodyfatModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Pré-sélectionner l'image si une valeur existe déjà
  const current = bodyfatInput.value;
  if (current) {
    selectedBodyfat = current;
    const grid = (selectedGender === 'femme' ? femmeGrid : hommeGrid);
    [...femmeGrid.querySelectorAll('img'), ...hommeGrid.querySelectorAll('img')].forEach(img => img.classList.remove('selected'));
    const img = grid.querySelector('img[data-value="' + current + '"]');
    if (img) {
      img.classList.add('selected');
      validateBodyfatBtn.disabled = false;
    }
  } else {
    clearBodyfatSelection();
  }
}
function closeBodyfatModal() {
  bodyfatModal.style.display = 'none';
  document.body.style.overflow = '';
  clearBodyfatSelection();
}
function clearBodyfatSelection() {
  [...femmeGrid.querySelectorAll('img'), ...hommeGrid.querySelectorAll('img')].forEach(img => img.classList.remove('selected'));
  // Ne pas réinitialiser selectedBodyfat si une valeur existe déjà
  if (!bodyfatInput.value) {
    selectedBodyfat = null;
    validateBodyfatBtn.disabled = true;
  }
}
genderRadios.forEach(radio => {
  radio.addEventListener('change', e => {
    selectedGender = e.target.value;
    if (selectedGender === 'femme') {
      femmeGrid.style.display = '';
      hommeGrid.style.display = 'none';
    } else {
      femmeGrid.style.display = 'none';
      hommeGrid.style.display = '';
    }
    clearBodyfatSelection();
  });
});
function handleImageClick(e) {
  const imgs = (selectedGender === 'femme' ? femmeGrid : hommeGrid).querySelectorAll('img');
  imgs.forEach(img => img.classList.remove('selected'));
  e.target.classList.add('selected');
  selectedBodyfat = e.target.getAttribute('data-value');
  validateBodyfatBtn.disabled = false;
}
femmeGrid.querySelectorAll('img').forEach(img => img.addEventListener('click', handleImageClick));
hommeGrid.querySelectorAll('img').forEach(img => img.addEventListener('click', handleImageClick));
validateBodyfatBtn.addEventListener('click', () => {
  if (selectedBodyfat) {
    bodyfatInput.value = selectedBodyfat;
    closeBodyfatModal();
    setTimeout(() => {
      showBodyfatValueDisplay();
      validateForm(false);
    }, 0);
  }
});
closeBodyfatBtn.addEventListener('click', () => {
  closeBodyfatModal();
  // Si pas de valeur sélectionnée, remettre le bouton
  if (!bodyfatInput.value) showBodyfatButton();
});
bodyfatModal.addEventListener('mousedown', function(e) {
  if (e.target === bodyfatModal) {
    closeBodyfatModal();
    if (!bodyfatInput.value) showBodyfatButton();
  }
});

// Validate a single field
function validateField(key) {
  const { el, min, max, required } = fields[key];
  const val = el.value.trim();
  let err = '';
  if (required && val === '') {
    err = 'Champ requis';
  } else if (key !== 'activity' && key !== 'bodyfat') {
    let num = parseFloat(val);
    if (isNaN(num)) {
      err = 'Entrée invalide';
    } else if ((min !== undefined && num < min) || (max !== undefined && num > max)) {
      err = `Doit être compris entre ${min} et ${max}`;
    }
  } else if (key === 'bodyfat') {
    let num = parseFloat(val);
    if (isNaN(num) || num < 5 || num > 60) {
      err = 'Sélectionnez un taux de graisse valide';
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
calcBtn.addEventListener('click', function(e) {
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

// Initialisation : bouton seul
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showBodyfatButton);
} else {
  showBodyfatButton();
} 
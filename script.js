const platosDisponibles = [32, 34, 36, 38, 40, 42, 44, 46];
const neumaticosDisponibles = [32, 35, 38, 40, 42, 45, 47, 50];
const pinones = [10, 11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 52];

const platosDiv = document.getElementById('platos');
const neumaticosDiv = document.getElementById('neumaticos');
const tablaResultados = document.getElementById('tabla-resultados');
const cadenciaMinInput = document.getElementById('cadenciaMin');
const cadenciaMaxInput = document.getElementById('cadenciaMax');
const valCadMin = document.getElementById('valCadMin');
const valCadMax = document.getElementById('valCadMax');

let prevCadMin;
let prevCadMax;

function loadPreferences() {
  const saved = JSON.parse(localStorage.getItem('gravelPrefs') || '{}');
  if (saved.platos) saved.platos.forEach(v => {
    const input = platosDiv.querySelector(`input[value="${v}"]`);
    if (input) input.checked = true;
  });
  if (saved.neumatico) {
    const input = neumaticosDiv.querySelector(`input[value="${saved.neumatico}"]`);
    if (input) input.checked = true;
  }
  if (saved.cadMin) cadenciaMinInput.value = saved.cadMin;
  if (saved.cadMax) cadenciaMaxInput.value = saved.cadMax;
}

function savePreferences() {
  const platos = [...platosDiv.querySelectorAll('input:checked')].map(e => +e.value);
  const neumatico = +neumaticosDiv.querySelector('input:checked')?.value || null;
  const cadMin = +cadenciaMinInput.value;
  const cadMax = +cadenciaMaxInput.value;
  const prefs = { platos, neumatico, cadMin, cadMax };
  localStorage.setItem('gravelPrefs', JSON.stringify(prefs));
}

function renderSelectores() {
  platosDisponibles.forEach(d => {
    const lbl = document.createElement('label');
    lbl.innerHTML = `<input type="checkbox" value="${d}"><span>${d}</span>`;
    platosDiv.appendChild(lbl);
  });

  neumaticosDisponibles.forEach(d => {
    const lbl = document.createElement('label');
    lbl.innerHTML = `<input type="radio" name="neumatico" value="${d}"><span>${d} mm</span>`;
    neumaticosDiv.appendChild(lbl);
  });

  loadPreferences();
  prevCadMin = +cadenciaMinInput.value;
  prevCadMax = +cadenciaMaxInput.value;
  actualizarValores();
}

function actualizarValores() {
  valCadMin.textContent = cadenciaMinInput.value;
  valCadMax.textContent = cadenciaMaxInput.value;
}

function calcularYRenderizarTabla() {
  actualizarValores();

  const platos = [...platosDiv.querySelectorAll('input:checked')].map(e => +e.value);
  const neumatico = +neumaticosDiv.querySelector('input:checked')?.value || null;
  const cadMin = +cadenciaMinInput.value;
  const cadMax = +cadenciaMaxInput.value;

  if (!platos.length || !neumatico) {
    tablaResultados.innerHTML = '';
    savePreferences();
    return;
  }

  const D = (700 + neumatico * 2) / 1000; // en metros
  const C = Math.PI * D;
  let html = '<div class="table-wrapper"><table><thead><tr><th class="sticky-col">Piñón</th>';
  platos.forEach(p => html += `<th>${p}</th>`);
  html += '</tr></thead><tbody>';

  pinones.forEach(pn => {
    html += `<tr><td class="sticky-col"><b>${pn}</b></td>`;
    platos.forEach(pl => {
      const metros = (pl / pn) * C;
      const velocidadMin = (cadMin * metros * 60) / 1000;
      const velocidadMax = (cadMax * metros * 60) / 1000;
      html += `<td><div>${metros.toFixed(2)} m</div><div>${velocidadMin.toFixed(1)}–${velocidadMax.toFixed(1)} km/h</div></td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  tablaResultados.innerHTML = html;
  savePreferences();
}

function ajustarCadenciaMin() {
  const newMin = +cadenciaMinInput.value;
  const delta = newMin - prevCadMin;
  if (newMin > prevCadMax) {
    let newMax = prevCadMax + delta;
    newMax = Math.min(newMax, +cadenciaMaxInput.max);
    cadenciaMaxInput.value = newMax;
  }
  prevCadMin = +cadenciaMinInput.value;
  prevCadMax = +cadenciaMaxInput.value;
  calcularYRenderizarTabla();
}

function ajustarCadenciaMax() {
  const newMax = +cadenciaMaxInput.value;
  const delta = newMax - prevCadMax;
  if (newMax < prevCadMin) {
    let newMin = prevCadMin + delta;
    newMin = Math.max(newMin, +cadenciaMinInput.min);
    cadenciaMinInput.value = newMin;
  }
  prevCadMin = +cadenciaMinInput.value;
  prevCadMax = +cadenciaMaxInput.value;
  calcularYRenderizarTabla();
}

renderSelectores();
platosDiv.addEventListener('change', calcularYRenderizarTabla);
neumaticosDiv.addEventListener('change', calcularYRenderizarTabla);
cadenciaMinInput.addEventListener('input', ajustarCadenciaMin);
cadenciaMaxInput.addEventListener('input', ajustarCadenciaMax);


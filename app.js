// ============ MENÚ MÓVIL ============
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ============ CARGA DE JSON (archivos en la misma carpeta) ============
async function cargarDatos() {
  try {
    const [ejercicios, rutinas, alimentos, videos] = await Promise.all([
      fetch('ejercicios.json').then(r => r.json()),
      fetch('rutinas.json').then(r => r.json()),
      fetch('alimentos.json').then(r => r.json()),
      fetch('videos.json').then(r => r.json())
    ]);
    return { ejercicios, rutinas, alimentos, videos };
  } catch (e) {
    console.error('Error cargando datos. ¿Estás usando Live Server o Netlify?', e);
    return { ejercicios: [], rutinas: [], alimentos: [], videos: [] };
  }
}

// ============ EJERCICIOS ============
let ejerciciosData = [];

function renderEjercicios(lista) {
  const grid = document.getElementById('ejerciciosGrid');
  if (!grid) return;
  grid.innerHTML = lista.length === 0
    ? '<p class="muted">No hay ejercicios con esos filtros.</p>'
    : lista.map(e => `
      <div class="ejercicio-card" onclick="abrirVideo('${e.videoId}')">
        <span class="tag">${e.grupo}</span>
        <h3>${e.nombre}</h3>
        <p>${e.descripcion}</p>
        <div class="ejercicio-meta">
          <span><strong>${e.series}</strong> series</span>
          <span><strong>${e.reps}</strong> reps</span>
          <span>${e.equipo}</span>
        </div>
      </div>
    `).join('');
}

function inicializarFiltrosEjercicios() {
  const grupoSel = document.getElementById('filterGrupo');
  const difSel = document.getElementById('filterDificultad');
  if (!grupoSel || !difSel) return;

  const grupos = [...new Set(ejerciciosData.map(e => e.grupo))].sort();
  grupos.forEach(g => {
    const o = document.createElement('option');
    o.value = g; o.textContent = g;
    grupoSel.appendChild(o);
  });

  const filtrar = () => {
    const g = grupoSel.value;
    const d = difSel.value;
    renderEjercicios(
      ejerciciosData.filter(e =>
        (!g || e.grupo === g) && (!d || e.dificultad === d)
      )
    );
  };
  grupoSel.addEventListener('change', filtrar);
  difSel.addEventListener('change', filtrar);
}

// ============ RUTINAS ============
function renderRutinas(rutinas, ejercicios) {
  const grid = document.getElementById('rutinasGrid');
  if (!grid) return;
  grid.innerHTML = rutinas.map(r => {
    const lista = r.ejercicios
      .map(id => ejercicios.find(e => e.id === id))
      .filter(Boolean)
      .map(e => `<li>${e.nombre} — ${e.series}×${e.reps}</li>`)
      .join('');
    return `
      <div class="rutina-card">
        <span class="badge-nivel">${r.nivel}</span>
        <h3>${r.nombre}</h3>
        <div class="rutina-info">
          ⏱ ${r.duracion} · ${r.frecuencia}<br>
          🎯 ${r.objetivo}
        </div>
        <div class="rutina-ejercicios">
          <h4>EJERCICIOS</h4>
          <ul>${lista}</ul>
        </div>
      </div>
    `;
  }).join('');
}

// ============ ALIMENTOS ============
let alimentosData = [];

function renderAlimentos(lista) {
  const tbody = document.getElementById('alimentosBody');
  if (!tbody) return;
  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="7" class="muted" style="text-align:center;padding:30px">Sin resultados</td></tr>'
    : lista.map(a => `
      <tr>
        <td>${a.nombre}</td>
        <td>${a.categoria}</td>
        <td>${a.porcion}</td>
        <td>${a.calorias}</td>
        <td>${a.proteinas} g</td>
        <td>${a.carbos} g</td>
        <td>${a.grasas} g</td>
      </tr>
    `).join('');
}

function inicializarFiltrosAlimentos() {
  const catSel = document.getElementById('filterCategoria');
  const search = document.getElementById('searchAlimento');
  if (!catSel || !search) return;

  const categorias = [...new Set(alimentosData.map(a => a.categoria))].sort();
  categorias.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    catSel.appendChild(o);
  });

  const filtrar = () => {
    const c = catSel.value;
    const q = search.value.toLowerCase().trim();
    renderAlimentos(alimentosData.filter(a =>
      (!c || a.categoria === c) &&
      (!q || a.nombre.toLowerCase().includes(q))
    ));
  };
  catSel.addEventListener('change', filtrar);
  search.addEventListener('input', filtrar);
}

// ============ VIDEOS + MODAL ============
function renderVideos(videos) {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;
  grid.innerHTML = videos.map(v => `
    <div class="video-item" onclick="abrirVideo('${v.videoId}')">
      <img src="${v.thumbnail}" alt="${v.titulo}">
      <div class="play">▶</div>
    </div>
  `).join('');
}

function abrirVideo(videoId) {
  const modal = document.getElementById('videoModal');
  const cont = document.getElementById('modalVideo');
  if (!modal || !cont) return;
  if (videoId && videoId !== 'VIDEO_ID_AQUI') {
    cont.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
      allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  } else {
    cont.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#a1a1aa;padding:20px;text-align:center">
      Reemplazá <code>VIDEO_ID_AQUI</code> en el JSON por un ID real de YouTube.
    </div>`;
  }
  modal.classList.add('open');
}
window.abrirVideo = abrirVideo;

document.getElementById('modalClose')?.addEventListener('click', () => {
  document.getElementById('videoModal').classList.remove('open');
  document.getElementById('modalVideo').innerHTML = '';
});

document.getElementById('videoModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'videoModal') {
    e.target.classList.remove('open');
    document.getElementById('modalVideo').innerHTML = '';
  }
});

// ============ AGENDADOR ============
const dateInput = document.getElementById('date');
const slotsContainer = document.getElementById('slots');
const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');
const ALL_SLOTS = ['07:00','08:00','09:00','10:00','17:00','18:00','19:00','20:00'];
let selectedSlot = null;

if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  const getDisabled = (dateStr) => {
    if (!dateStr) return [];
    const day = new Date(dateStr).getDay();
    if (day === 0) return [...ALL_SLOTS];
    if (day === 6) return ['07:00','08:00'];
    return ALL_SLOTS.filter((_, i) => i % 3 === 0);
  };

  const renderSlots = (disabled = []) => {
    slotsContainer.innerHTML = '';
    selectedSlot = null;
    ALL_SLOTS.forEach(time => {
      const div = document.createElement('div');
      div.className = 'slot';
      div.textContent = time;
      if (disabled.includes(time)) {
        div.classList.add('disabled');
      } else {
        div.addEventListener('click', () => {
          document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
          div.classList.add('selected');
          selectedSlot = time;
        });
      }
      slotsContainer.appendChild(div);
    });
  };

  renderSlots(getDisabled(today));
  dateInput.addEventListener('change', () => renderSlots(getDisabled(dateInput.value)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    if (!name || !email || !service || !dateInput.value) {
      alert('Completá todos los campos.');
      return;
    }
    if (!selectedSlot) {
      alert('Seleccioná un horario disponible.');
      return;
    }
    console.log('Reserva:', { name, email, service, date: dateInput.value, time: selectedSlot });
    msg.classList.add('show');
    form.reset();
    renderSlots(getDisabled(today));
    setTimeout(() => msg.classList.remove('show'), 6000);
  });
}

// ============ INICIALIZACIÓN ============
(async () => {
  const { ejercicios, rutinas, alimentos, videos } = await cargarDatos();
  ejerciciosData = ejercicios;
  alimentosData = alimentos;

  renderEjercicios(ejercicios);
  inicializarFiltrosEjercicios();

  renderRutinas(rutinas, ejercicios);

  renderAlimentos(alimentos);
  inicializarFiltrosAlimentos();

  renderVideos(videos);
})();
// ============ UTILIDADES ============

// Escapa texto para insertarlo seguro en HTML (evita XSS)
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escapa texto para insertarlo seguro en un atributo HTML
function escapeAttr(str) {
  return escapeHtml(str);
}

// Muestra un mensaje de estado (cargando / vacío)
function mostrarEstado(id, texto) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<p class="muted" style="text-align:center;padding:20px">${escapeHtml(texto)}</p>`;
}

// ============ MENÚ MÓVIL ============
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn?.addEventListener('click', () => navLinks?.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ============ CARGA DE JSON ============
async function cargarDatos() {
  const archivos = ['ejercicios', 'rutinas', 'alimentos', 'videos'];
  const resultados = await Promise.allSettled(
    archivos.map(a => fetch(`${a}.json`).then(r => r.json()))
  );

  const datos = {};
  archivos.forEach((nombre, i) => {
    const r = resultados[i];
    if (r.status === 'fulfilled') {
      datos[nombre] = Array.isArray(r.value) ? r.value : [];
    } else {
      console.error(`Error cargando ${nombre}.json`, r.reason);
      datos[nombre] = [];
    }
  });
  return datos;
}

// ============ EJERCICIOS ============
let ejerciciosData = [];

function renderEjercicios(lista) {
  const grid = document.getElementById('ejerciciosGrid');
  if (!grid) return;

  if (lista.length === 0) {
    grid.innerHTML = '<p class="muted" style="text-align:center;padding:20px">No hay ejercicios con esos filtros.</p>';
    return;
  }

  grid.innerHTML = lista.map(e => `
    <div class="ejercicio-card"
         data-video-id="${escapeAttr(e.videoId || '')}"
         data-query="${escapeAttr(e.searchQuery || e.nombre || '')}">
      <span class="tag">${escapeHtml(e.grupo)}</span>
      <h3>${escapeHtml(e.nombre)}</h3>
      <p>${escapeHtml(e.descripcion)}</p>
      <div class="ejercicio-meta">
        <span><strong>${escapeHtml(e.series)}</strong> series</span>
        <span><strong>${escapeHtml(e.reps)}</strong> reps</span>
        <span>${escapeHtml(e.equipo)}</span>
      </div>
    </div>
  `).join('');

  // Event delegation (mucho más seguro que onclick inline)
  grid.querySelectorAll('.ejercicio-card').forEach(card => {
    card.addEventListener('click', () => {
      abrirVideo(card.dataset.videoId, card.dataset.query);
    });
  });
}

function inicializarFiltrosEjercicios() {
  const grupoSel = document.getElementById('filterGrupo');
  const difSel = document.getElementById('filterDificultad');
  if (!grupoSel || !difSel) return;

  // Solo agregar opciones que no existan ya
  const grupos = [...new Set(ejerciciosData.map(e => e.grupo).filter(Boolean))].sort();
  grupos.forEach(g => {
    const o = document.createElement('option');
    o.value = g;
    o.textContent = g;
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

  if (!Array.isArray(rutinas) || rutinas.length === 0) {
    grid.innerHTML = '<p class="muted" style="text-align:center;padding:20px">No hay rutinas disponibles por ahora.</p>';
    return;
  }

  grid.innerHTML = rutinas.map(r => {
    const lista = (r.ejercicios || [])
      .map(id => ejercicios.find(e => e.id === id))
      .filter(Boolean)
      .map(e => `<li>${escapeHtml(e.nombre)} — ${escapeHtml(e.series)}×${escapeHtml(e.reps)}</li>`)
      .join('') || '<li class="muted">Sin ejercicios asignados</li>';

    return `
      <div class="rutina-card">
        <span class="badge-nivel">${escapeHtml(r.nivel)}</span>
        <h3>${escapeHtml(r.nombre)}</h3>
        <div class="rutina-info">
          ⏱ ${escapeHtml(r.duracion)} · ${escapeHtml(r.frecuencia)}<br>
          🎯 ${escapeHtml(r.objetivo)}
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

  if (lista.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="muted" style="text-align:center;padding:30px">Sin resultados</td></tr>';
    return;
  }

  tbody.innerHTML = lista.map(a => `
    <tr>
      <td>${escapeHtml(a.nombre)}</td>
      <td>${escapeHtml(a.categoria)}</td>
      <td>${escapeHtml(a.porcion)}</td>
      <td>${escapeHtml(a.calorias)}</td>
      <td>${escapeHtml(a.proteinas)} g</td>
      <td>${escapeHtml(a.carbos)} g</td>
      <td>${escapeHtml(a.grasas)} g</td>
    </tr>
  `).join('');
}

function inicializarFiltrosAlimentos() {
  const catSel = document.getElementById('filterCategoria');
  const search = document.getElementById('searchAlimento');
  if (!catSel || !search) return;

  const categorias = [...new Set(alimentosData.map(a => a.categoria).filter(Boolean))].sort();
  categorias.forEach(c => {
    const o = document.createElement('option');
    o.value = c;
    o.textContent = c;
    catSel.appendChild(o);
  });

  const filtrar = () => {
    const c = catSel.value;
    const q = search.value.toLowerCase().trim();
    renderAlimentos(alimentosData.filter(a =>
      (!c || a.categoria === c) &&
      (!q || String(a.nombre || '').toLowerCase().includes(q))
    ));
  };
  catSel.addEventListener('change', filtrar);
  search.addEventListener('input', filtrar);
}

// ============ VIDEOS + MODAL ============
function renderVideos(videos) {
  const grid = document.getElementById('videosGrid');
  if (!grid) return;

  if (!Array.isArray(videos) || videos.length === 0) {
    grid.innerHTML = '<p class="muted" style="text-align:center;padding:20px">No hay videos por ahora.</p>';
    return;
  }

  grid.innerHTML = videos.map(v => `
    <div class="video-item"
         data-video-id="${escapeAttr(v.videoId || '')}"
         data-query="${escapeAttr(v.titulo || '')}">
      <img src="${escapeAttr(v.thumbnail)}" alt="${escapeAttr(v.titulo)}" loading="lazy">
      <div class="play">▶</div>
    </div>
  `).join('');

  grid.querySelectorAll('.video-item').forEach(item => {
    item.addEventListener('click', () => {
      abrirVideo(item.dataset.videoId, item.dataset.query);
    });
  });
}

function abrirVideo(videoId, searchQuery) {
  const modal = document.getElementById('videoModal');
  const cont = document.getElementById('modalVideo');
  if (!modal || !cont) return;

  const query = encodeURIComponent(searchQuery || '');

  if (videoId && videoId.trim() !== '') {
    cont.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1"
      allow="autoplay; encrypted-media"
      allowfullscreen></iframe>`;
  } else {
    cont.innerHTML = `
      <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:30px;text-align:center">
        <p style="color:#a1a1aa;font-size:1rem;max-width:500px">
          Este ejercicio todavía no tiene video propio cargado.<br>
          Podés buscarlo en YouTube mientras tanto:
        </p>
        <a href="https://www.youtube.com/results?search_query=${query}"
           target="_blank" rel="noopener" class="btn">
          🔍 Buscar "${escapeHtml(searchQuery)}" en YouTube
        </a>
      </div>
    `;
  }
  modal.classList.add('open');
}
window.abrirVideo = abrirVideo;

document.getElementById('modalClose')?.addEventListener('click', () => {
  const modal = document.getElementById('videoModal');
  modal?.classList.remove('open');
  const cont = document.getElementById('modalVideo');
  if (cont) cont.innerHTML = '';
});

document.getElementById('videoModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'videoModal') {
    e.target.classList.remove('open');
    const cont = document.getElementById('modalVideo');
    if (cont) cont.innerHTML = '';
  }
});

// Cerrar modal con tecla Escape (bonus de UX)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('videoModal');
    if (modal?.classList.contains('open')) {
      modal.classList.remove('open');
      const cont = document.getElementById('modalVideo');
      if (cont) cont.innerHTML = '';
    }
  }
});

// ============ AGENDADOR ============
const dateInput = document.getElementById('date');
const slotsContainer = document.getElementById('slots');
const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');
const ALL_SLOTS = ['07:00', '08:00', '09:00', '10:00', '17:00', '18:00', '19:00', '20:00'];
let selectedSlot = null;

if (dateInput && slotsContainer && form) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  const getDisabled = (dateStr) => {
    if (!dateStr) return [];
    const day = new Date(dateStr + 'T00:00:00').getDay();
    if (day === 0) return [...ALL_SLOTS]; // Domingo: cerrado
    if (day === 6) return ['07:00', '08:00']; // Sábado: mañana cerrada
    return ALL_SLOTS.filter((_, i) => i % 3 === 0); // Lunes a viernes
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
          slotsContainer.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
          div.classList.add('selected');
          selectedSlot = time;
        });
      }
      slotsContainer.appendChild(div);
    });
  };

  renderSlots(getDisabled(today));
  dateInput.addEventListener('change', () => renderSlots(getDisabled(dateInput.value)));

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const date = dateInput.value;

    // Validaciones
    if (!name || !email || !service || !date) {
      alert('Completá todos los campos.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Poné un email válido.');
      return;
    }
    if (!selectedSlot) {
      alert('Seleccioná un horario disponible.');
      return;
    }

    document.getElementById('time').value = selectedSlot;

    const boton = form.querySelector('button[type="submit"]');
    const textoOriginal = boton.textContent;
    boton.textContent = 'Enviando...';
    boton.disabled = true;

    // Timeout para que no se quede colgado si Formspree tarda
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      if (response.ok) {
        msg.classList.add('show');
        form.reset();
        selectedSlot = null;
        renderSlots([]); // Slots limpios tras enviar
        setTimeout(() => msg.classList.remove('show'), 6000);
      } else {
        alert('Hubo un error al enviar. Probá de nuevo.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        alert('La conexión tardó demasiado. Probá de nuevo.');
      } else {
        alert('Error de conexión. Revisá tu internet.');
      }
    } finally {
      clearTimeout(timeout);
      boton.textContent = textoOriginal;
      boton.disabled = false;
    }
  });
}

// ============ INICIALIZACIÓN ============
(async () => {
  // Mostrar "Cargando..." mientras llegan los datos
  mostrarEstado('ejerciciosGrid', 'Cargando ejercicios...');
  mostrarEstado('rutinasGrid', 'Cargando rutinas...');
  mostrarEstado('videosGrid', 'Cargando videos...');

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

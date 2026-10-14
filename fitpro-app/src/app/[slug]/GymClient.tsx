'use client'

import { useState } from 'react'

type Gym = any
type Item = any

export default function GymClient({
  gym, servicios, ejercicios, rutinas, rutinaEjercicios, posts, videos, alimentos,
}: {
  gym: Gym
  servicios: Item[]
  ejercicios: Item[]
  rutinas: Item[]
  rutinaEjercicios: Item[]
  posts: Item[]
  videos: Item[]
  alimentos: Item[]
}) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [grupo, setGrupo] = useState('')
  const [dificultad, setDificultad] = useState('')
  const [categoria, setCategoria] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const grupos = [...new Set(ejercicios.map((e) => e.grupo_muscular))].sort()
  const categorias = [...new Set(alimentos.map((a) => a.categoria))].sort()

  const ejerciciosFiltrados = ejercicios.filter(
    (e) => (!grupo || e.grupo_muscular === grupo) && (!dificultad || e.dificultad === dificultad)
  )

  const alimentosFiltrados = alimentos.filter(
    (a) =>
      (!categoria || a.categoria === categoria) &&
      (!busqueda || a.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <>
      <header>
        <nav>
          <div className="logo">
            {gym.nombre}
            <span>{gym.sufijo}</span>
          </div>
          <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
            ☰
          </button>
          <ul className={`nav-links ${menuAbierto ? 'open' : ''}`}>
            <li><a href="#about" onClick={() => setMenuAbierto(false)}>Sobre mí</a></li>
            <li><a href="#servicios" onClick={() => setMenuAbierto(false)}>Servicios</a></li>
            <li><a href="#ejercicios" onClick={() => setMenuAbierto(false)}>Ejercicios</a></li>
            <li><a href="#rutinas" onClick={() => setMenuAbierto(false)}>Rutinas</a></li>
            <li><a href="#alimentos" onClick={() => setMenuAbierto(false)}>Alimentos</a></li>
            <li><a href="#videos" onClick={() => setMenuAbierto(false)}>Videos</a></li>
            <li><a href="#blog" onClick={() => setMenuAbierto(false)}>Blog</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="container hero-content">
          <h1>
            {gym.titulo_hero} <span>{gym.subtitulo_hero}</span>
          </h1>
          <p>{gym.descripcion}</p>
          <div className="hero-actions">
            <a href="#booking" className="btn">Reservá tu clase</a>
            <a href="#servicios" className="btn btn-outline">Ver servicios</a>
          </div>
        </div>
      </section>

      <section className="services" id="servicios">
        <div className="container">
          <h2 className="section-title">Servicios</h2>
          <div className="services-grid">
            {servicios.map((s) => (
              <div key={s.id} className="service-card">
                <h3>{s.nombre}</h3>
                <div className="price">
                  ${Number(s.precio).toLocaleString('es-AR')} {s.moneda}
                </div>
                <p>{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ejercicios">
        <div className="container">
          <h2 className="section-title">Biblioteca de ejercicios</h2>
          <p className="section-sub">Filtrá por grupo muscular o dificultad.</p>

          <div className="filters">
            <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
              <option value="">Todos los grupos</option>
              {grupos.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
              <option value="">Todas las dificultades</option>
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </div>

          <div className="ejercicios-grid">
            {ejerciciosFiltrados.length === 0 ? (
              <p className="muted">No hay ejercicios con esos filtros.</p>
            ) : (
              ejerciciosFiltrados.map((e) => (
                <div key={e.id} className="ejercicio-card" onClick={() => e.video_url && setVideoId(e.video_url)}>
                  <span className="tag">{e.grupo_muscular}</span>
                  <h3>{e.nombre}</h3>
                  <p>{e.descripcion}</p>
                  <div className="ejercicio-meta">
                    <span>{e.equipamiento}</span>
                    <span><strong>{e.dificultad}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="services" id="rutinas">
        <div className="container">
          <h2 className="section-title">Rutinas listas para usar</h2>
          <div className="rutinas-grid">
            {rutinas.map((r) => {
              const ejs = rutinaEjercicios
                .filter((re) => re.rutina_id === r.id)
                .map((re) => ejercicios.find((e) => e.id === re.ejercicio_id))
                .filter(Boolean)
              return (
                <div key={r.id} className="rutina-card">
                  <span className="badge-nivel">{r.nivel}</span>
                  <h3>{r.nombre}</h3>
                  <div className="rutina-info">
                    🎯 {r.objetivo}<br />
                    📅 {r.duracion_semanas} semanas
                  </div>
                  <div className="rutina-ejercicios">
                    <h4>EJERCICIOS</h4>
                    <ul>
                      {ejs.map((e: any) => <li key={e.id}>{e.nombre}</li>)}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="alimentos">
        <div className="container">
          <h2 className="section-title">Guía de alimentos</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Buscar alimento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="">Todas las categorías</option>
              {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="tabla-wrapper">
            <table className="tabla-alimentos">
              <thead>
                <tr>
                  <th>Alimento</th><th>Categoría</th><th>Porción</th>
                  <th>Kcal</th><th>Prot.</th><th>Carb.</th><th>Grasas</th>
                </tr>
              </thead>
              <tbody>
                {alimentosFiltrados.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td>
                    <td>{a.categoria}</td>
                    <td>{a.porcion}</td>
                    <td>{a.kcal}</td>
                    <td>{a.proteinas} g</td>
                    <td>{a.carbohidratos} g</td>
                    <td>{a.grasas} g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="services" id="videos">
        <div className="container">
          <h2 className="section-title">Mi trabajo en acción</h2>
          <div className="videos-grid">
            {videos.map((v) => (
              <div key={v.id} className="video-item" onClick={() => v.youtube_id && setVideoId(v.youtube_id)}>
                <img src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`} alt={v.titulo} />
                <div className="play">▶</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blog" id="blog">
        <div className="container">
          <h2 className="section-title">Consejos profesionales</h2>
          <div className="blog-grid">
            {posts.map((p) => (
              <article key={p.id} className="post">
                <div className="post-body">
                  <span className="post-tag">{p.tag}</span>
                  <h3>{p.titulo}</h3>
                  <p>{p.extracto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <div>
            <div className="logo">
              {gym.nombre}<span>{gym.sufijo}</span>
            </div>
            <p>{gym.descripcion}</p>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href={`mailto:${gym.email_contacto}`}>{gym.email_contacto}</a>
            <a href={`tel:${gym.telefono}`}>{gym.telefono}</a>
            <a>{gym.direccion}, {gym.ciudad}</a>
          </div>
        </div>
        <p className="copy">© 2026 {gym.nombre}{gym.sufijo}. Todos los derechos reservados.</p>
      </footer>

      {gym.whatsapp && (
        <a href={`https://wa.me/${gym.whatsapp.replace(/\D/g, '')}`} className="whatsapp" target="_blank">
          💬
        </a>
      )}

      <div className={`modal ${videoId ? 'open' : ''}`} onClick={() => setVideoId(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setVideoId(null)}>✕</button>
          <div className="modal-video">
            {videoId && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
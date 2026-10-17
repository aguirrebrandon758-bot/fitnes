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

  // Filtros
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

  // Colores dinámicos inyectados como variables CSS
  const dynamicStyles = {
    '--accent': gym.color_primario || '#ff5a1f',
    '--accent-2': gym.color_secundario || '#ffb703',
  } as React.CSSProperties

  return (
    <div style={dynamicStyles}>
      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(14,14,16,.85)', backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid #26262c' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.5px', display: 'flex', alignItems: 'center' }}>
            {gym.logo_url ? (
              <img src={gym.logo_url} alt={gym.nombre} style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
              <span>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></span>
            )}
          </div>
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '1.6rem', cursor: 'pointer' }}
            className="menu-btn-public"
          >
            ☰
          </button>
          <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center' }}>
            <li><a href="#servicios" style={{ color: '#a1a1aa', fontWeight: 500 }}>Servicios</a></li>
            <li><a href="#ejercicios" style={{ color: '#a1a1aa', fontWeight: 500 }}>Ejercicios</a></li>
            <li><a href="#rutinas" style={{ color: '#a1a1aa', fontWeight: 500 }}>Rutinas</a></li>
            <li><a href="#alimentos" style={{ color: '#a1a1aa', fontWeight: 500 }}>Alimentos</a></li>
            <li><a href="#videos" style={{ color: '#a1a1aa', fontWeight: 500 }}>Videos</a></li>
          </ul>
        </nav>
      </header>

      {/* HERO */}
      <section 
        id="home" 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          paddingTop: '80px',
          background: gym.hero_img_url 
            ? `linear-gradient(rgba(14,14,16,.75),rgba(14,14,16,.9)), url(${gym.hero_img_url}) center/cover` 
            : 'linear-gradient(rgba(14,14,16,.75),rgba(14,14,16,.9)), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600) center/cover'
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 800 }}>
              {gym.titulo_hero || 'Transforma tu cuerpo'} <br />
              <span style={{ color: 'var(--accent)' }}>{gym.subtitulo_hero || 'en 90 días'}</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#d4d4d8', marginBottom: '34px' }}>
              {gym.descripcion || 'Entrenamiento personalizado, plan nutricional y seguimiento real. Sin excusas, solo resultados.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href={`https://wa.me/${gym.whatsapp?.replace(/\D/g, '') || ''}`} target="_blank" rel="noopener" className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '14px 28px', borderRadius: '999px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                Reserva tu clase gratis
              </a>
              <a href="#servicios" style={{ background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)', padding: '14px 28px', borderRadius: '999px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                Ver programas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      {servicios.length > 0 && (
        <section id="servicios" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Programas y servicios</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '50px', maxWidth: '600px' }}>Elige el plan que mejor se adapte a tus objetivos.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {servicios.map((s: any) => (
                <div key={s.id} style={{ background: '#1e1e24', padding: '32px', borderRadius: '14px', border: '1px solid #2a2a32' }}>
                  <h3 style={{ marginBottom: '10px' }}>{s.nombre}</h3>
                  <div style={{ color: 'var(--accent-2)', fontWeight: 700, fontSize: '1.2rem', margin: '14px 0' }}>{s.precio}</div>
                  <p style={{ color: '#a1a1aa', fontSize: '.95rem' }}>{s.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EJERCICIOS */}
      {ejercicios.length > 0 && (
        <section id="ejercicios" style={{ padding: '90px 0' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Biblioteca de ejercicios</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '30px', maxWidth: '600px' }}>Filtrá por grupo muscular o dificultad.</p>
            
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <select value={grupo} onChange={(e) => setGrupo(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #2a2a32', background: '#1e1e24', color: '#fff' }}>
                <option value="">Todos los grupos</option>
                {grupos.map((g: any) => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={dificultad} onChange={(e) => setDificultad(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #2a2a32', background: '#1e1e24', color: '#fff' }}>
                <option value="">Todas las dificultades</option>
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {ejerciciosFiltrados.map((e: any) => (
                <div key={e.id} onClick={() => e.video_url && setVideoId(e.video_url)} style={{ background: '#1e1e24', border: '1px solid #2a2a32', borderRadius: '14px', padding: '22px', cursor: e.video_url ? 'pointer' : 'default' }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'rgba(255,90,31,.15)', color: 'var(--accent)', marginBottom: '10px' }}>{e.grupo_muscular}</span>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{e.nombre}</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '.9rem', marginBottom: '14px' }}>{e.descripcion}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: '#a1a1aa', borderTop: '1px solid #2a2a32', paddingTop: '12px' }}>
                    <span>{e.equipamiento}</span>
                    <span style={{ color: 'var(--accent-2)' }}>{e.dificultad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RUTINAS */}
      {rutinas.length > 0 && (
        <section id="rutinas" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Rutinas</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '50px', maxWidth: '600px' }}>Programas armados por objetivo.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {rutinas.map((r: any) => (
                <div key={r.id} style={{ background: '#1e1e24', border: '1px solid #2a2a32', borderRadius: '14px', padding: '26px' }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'rgba(255,183,3,.15)', color: 'var(--accent-2)', marginBottom: '12px' }}>{r.nivel}</span>
                  <h3 style={{ marginBottom: '8px' }}>{r.nombre}</h3>
                  <div style={{ color: '#a1a1aa', fontSize: '.88rem', lineHeight: 1.8 }}>
                    🎯 {r.objetivo} · 📅 {r.duracion_semanas} semanas
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ALIMENTOS */}
      {alimentos.length > 0 && (
        <section id="alimentos" style={{ padding: '90px 0' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Guía de alimentos</h2>
            <p style={{ color: '#a1a1aa', marginBottom: '30px', maxWidth: '600px' }}>Macros por porción para tu plan nutricional.</p>
            
            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid #2a2a32' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr style={{ background: '#141418', color: '#a1a1aa', fontSize: '.78rem', textAlign: 'left' }}>
                    <th style={{ padding: '14px' }}>Alimento</th>
                    <th style={{ padding: '14px' }}>Categoría</th>
                    <th style={{ padding: '14px' }}>Porción</th>
                    <th style={{ padding: '14px' }}>Kcal</th>
                    <th style={{ padding: '14px' }}>Prot.</th>
                    <th style={{ padding: '14px' }}>Carb.</th>
                    <th style={{ padding: '14px' }}>Grasas</th>
                  </tr>
                </thead>
                <tbody>
                  {alimentosFiltrados.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #232329' }}>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{a.nombre}</td>
                      <td style={{ padding: '14px', color: '#a1a1aa' }}>{a.categoria}</td>
                      <td style={{ padding: '14px' }}>{a.porcion}</td>
                      <td style={{ padding: '14px', color: 'var(--accent-2)', fontWeight: 'bold' }}>{a.kcal}</td>
                      <td style={{ padding: '14px' }}>{a.proteinas}g</td>
                      <td style={{ padding: '14px' }}>{a.carbohidratos}g</td>
                      <td style={{ padding: '14px' }}>{a.grasas}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section id="videos" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Mi trabajo en acción</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '40px' }}>
              {videos.map((v: any) => (
                <div key={v.id} onClick={() => v.youtube_id && setVideoId(v.youtube_id)} style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/10', background: '#000', cursor: 'pointer' }}>
                  <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`} alt={v.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff' }}>▶</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0c', padding: '60px 20px 30px', borderTop: '1px solid #26262c' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '10px' }}>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></div>
            <p style={{ color: '#a1a1aa', fontSize: '.92rem' }}>{gym.descripcion || 'Entrenamiento personal y transformación real.'}</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '14px' }}>Contacto</h4>
            <p style={{ color: '#a1a1aa', fontSize: '.92rem' }}>{gym.email_contacto}</p>
            <p style={{ color: '#a1a1aa', fontSize: '.92rem' }}>{gym.telefono}</p>
            <p style={{ color: '#a1a1aa', fontSize: '.92rem' }}>{gym.direccion}, {gym.ciudad}</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '14px' }}>Sígueme</h4>
            <a href={`https://instagram.com/${gym.instagram?.replace('@', '')}`} style={{ color: '#a1a1aa', fontSize: '.92rem', display: 'block', marginBottom: '8px' }}>Instagram</a>
            <a href={`https://youtube.com/${gym.youtube}`} style={{ color: '#a1a1aa', fontSize: '.92rem', display: 'block', marginBottom: '8px' }}>YouTube</a>
            <a href={`https://tiktok.com/${gym.tiktok}`} style={{ color: '#a1a1aa', fontSize: '.92rem', display: 'block' }}>TikTok</a>
          </div>
        </div>
        <p style={{ textAlign: 'center', color: '#52525b', fontSize: '.85rem', marginTop: '40px' }}>© 2026 {gym.nombre}. Todos los derechos reservados.</p>
      </footer>

      {/* MODAL VIDEO */}
      {videoId && (
        <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', background: '#000', borderRadius: '14px', overflow: 'hidden' }}>
            <button onClick={() => setVideoId(null)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, background: 'rgba(0,0,0,.7)', color: '#fff', border: 'none', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            <div style={{ aspectRatio: '16/9', width: '100%' }}>
              <iframe 
                src={`https://www.youtube.com/embed/${videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1] || videoId}?autoplay=1`} 
                allow="autoplay; encrypted-media" 
                allowFullScreen 
                style={{ width: '100%', height: '100%', border: 'none' }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

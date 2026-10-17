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

  const dynamicStyles = {
    '--accent': gym.color_primario || '#ff5a1f',
    '--accent-2': gym.color_secundario || '#ffb703',
  } as React.CSSProperties

  return (
    <div style={dynamicStyles}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(14,14,16,.85)', backdropFilter: 'blur(10px)', zIndex: 100, borderBottom: '1px solid #26262c' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center' }}>
            {gym.logo_url ? (
              <img src={gym.logo_url} alt={gym.nombre} style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
              <span>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></span>
            )}
          </div>
          <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center' }}>
            <li><a href="#servicios" style={{ color: '#a1a1aa', fontWeight: 500 }}>Servicios</a></li>
            <li><a href="#ejercicios" style={{ color: '#a1a1aa', fontWeight: 500 }}>Ejercicios</a></li>
            <li><a href="#rutinas" style={{ color: '#a1a1aa', fontWeight: 500 }}>Rutinas</a></li>
            <li><a href="#alimentos" style={{ color: '#a1a1aa', fontWeight: 500 }}>Alimentos</a></li>
            <li><a href="#videos" style={{ color: '#a1a1aa', fontWeight: 500 }}>Videos</a></li>
          </ul>
        </nav>
      </header>

      <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', background: gym.hero_img_url ? `linear-gradient(rgba(14,14,16,.75),rgba(14,14,16,.9)), url(${gym.hero_img_url}) center/cover` : 'linear-gradient(rgba(14,14,16,.75),rgba(14,14,16,.9)), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600) center/cover' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 800 }}>
              {gym.titulo_hero || 'Transforma tu cuerpo'} <br />
              <span style={{ color: 'var(--accent)' }}>{gym.subtitulo_hero || 'en 90 días'}</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#d4d4d8', marginBottom: '34px' }}>
              {gym.descripcion || 'Entrenamiento personalizado, plan nutricional y seguimiento real.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href={`https://wa.me/${gym.whatsapp?.replace(/\D/g, '') || ''}`} target="_blank" rel="noopener" className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '14px 28px', borderRadius: '999px', fontWeight: 600, textDecoration: 'none' }}>Reserva tu clase gratis</a>
            </div>
          </div>
        </div>
      </section>

      {servicios.length > 0 && (
        <section id="servicios" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Programas y servicios</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {servicios.map((s: any) => (
                <div key={s.id} style={{ background: '#1e1e24', padding: '32px', borderRadius: '14px', border: '1px solid #2a2a32' }}>
                  <h3>{s.nombre}</h3>
                  <div style={{ color: 'var(--accent-2)', fontWeight: 700, margin: '14px 0' }}>{s.precio}</div>
                  <p style={{ color: '#a1a1aa', fontSize: '.95rem' }}>{s.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {ejercicios.length > 0 && (
        <section id="ejercicios" style={{ padding: '90px 0' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px' }}>Biblioteca de ejercicios</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {ejerciciosFiltrados.map((e: any) => (
                <div key={e.id} onClick={() => e.video_url && setVideoId(e.video_url)} style={{ background: '#1e1e24', border: '1px solid #2a2a32', borderRadius: '14px', padding: '22px', cursor: e.video_url ? 'pointer' : 'default' }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'rgba(255,90,31,.15)', color: 'var(--accent)', marginBottom: '10px' }}>{e.grupo_muscular}</span>
                  <h3>{e.nombre}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem', color: '#a1a1aa', borderTop: '1px solid #2a2a32', paddingTop: '12px', marginTop: '12px' }}>
                    <span>{e.equipamiento}</span>
                    <span style={{ color: 'var(--accent-2)' }}>{e.dificultad}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {rutinas.length > 0 && (
        <section id="rutinas" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Rutinas</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {rutinas.map((r: any) => (
                <div key={r.id} style={{ background: '#1e1e24', border: '1px solid #2a2a32', borderRadius: '14px', padding: '26px' }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'rgba(255,183,3,.15)', color: 'var(--accent-2)', marginBottom: '12px' }}>{r.nivel}</span>
                  <h3>{r.nombre}</h3>
                  <div style={{ color: '#a1a1aa', fontSize: '.88rem', lineHeight: 1.8 }}>🎯 {r.objetivo} · 📅 {r.duracion_semanas} semanas</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {alimentos.length > 0 && (
        <section id="alimentos" style={{ padding: '90px 0' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px' }}>Guía de alimentos</h2>
            <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid #2a2a32' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
                <thead>
                  <tr style={{ background: '#141418', color: '#a1a1aa', fontSize: '.78rem', textAlign: 'left' }}>
                    <th style={{ padding: '14px' }}>Alimento</th><th style={{ padding: '14px' }}>Porción</th><th style={{ padding: '14px' }}>Kcal</th><th style={{ padding: '14px' }}>Prot.</th>
                  </tr>
                </thead>
                <tbody>
                  {alimentosFiltrados.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #232329' }}>
                      <td style={{ padding: '14px', fontWeight: 600 }}>{a.nombre}</td><td style={{ padding: '14px' }}>{a.porcion}</td><td style={{ padding: '14px', color: 'var(--accent-2)' }}>{a.kcal}</td><td style={{ padding: '14px' }}>{a.proteinas}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section id="videos" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px' }}>Mi trabajo en acción</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
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

      <footer style={{ background: '#0a0a0c', padding: '60px 20px 30px', borderTop: '1px solid #26262c' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <div><div style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '10px' }}>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></div></div>
          <div><h4 style={{ marginBottom: '14px' }}>Contacto</h4><p style={{ color: '#a1a1aa', fontSize: '.92rem' }}>{gym.email_contacto}</p></div>
        </div>
      </footer>

      {videoId && (
        <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', background: '#000', borderRadius: '14px', overflow: 'hidden' }}>
            <button onClick={() => setVideoId(null)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, background: 'rgba(0,0,0,.7)', color: '#fff', border: 'none', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            <div style={{ aspectRatio: '16/9', width: '100%' }}>
              <iframe src={`https://www.youtube.com/embed/${videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1] || videoId}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

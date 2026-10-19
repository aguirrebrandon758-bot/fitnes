'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPanel from './AdminPanel'

type Gym = any
type Item = any

export default function GymClient({
  gym, isOwner, servicios, ejercicios, rutinas, rutinaEjercicios, posts, videos, alimentos, testimonios
}: {
  gym: Gym
  isOwner: boolean
  servicios: Item[]
  ejercicios: Item[]
  rutinas: Item[]
  rutinaEjercicios: Item[]
  posts: Item[]
  videos: Item[]
  alimentos: Item[]
  testimonios: Item[]
}) {
  const [videoId, setVideoId] = useState<string | null>(null)

  const dynamicStyles = {
    '--accent': gym.color_primario || '#ff5a1f',
    '--accent-2': gym.color_secundario || '#ffb703',
  } as React.CSSProperties

  return (
    <div style={dynamicStyles}>
      
      {/* HEADER PÚBLICO */}
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
            <li><a href="#ejercicios" style={{ color: '#a1a1aa', fontWeight: 500 }}>Ejercicios</a></li>
            <li><a href="#videos" style={{ color: '#a1a1aa', fontWeight: 500 }}>Videos</a></li>
            {testimonios.length > 0 && <li><a href="#testimonios" style={{ color: 'var(--accent)', fontWeight: 600 }}>Opiniones</a></li>}
          </ul>
        </nav>
      </header>

      {/* 👇 SI ES EL DUEÑO, MOSTRAMOS EL PANEL DE ADMIN 👇 */}
      {isOwner && (
        <div style={{ paddingTop: '70px' }}>
          <AdminPanel gym={gym} />
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight: isOwner ? '80vh' : '100vh', display: 'flex', alignItems: 'center', paddingTop: isOwner ? '140px' : '80px', background: gym.hero_img_url ? `linear-gradient(rgba(14,14,16,.75),rgba(14,14,16,.9)), url(${gym.hero_img_url}) center/cover` : 'linear-gradient(rgba(14,14,16,.75),rgba(14,14,16,.9)), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600) center/cover' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 800 }}>
              {gym.titulo_hero || 'Transforma tu cuerpo'} <br />
              <span style={{ color: 'var(--accent)' }}>{gym.subtitulo_hero || 'en 90 días'}</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#d4d4d8', marginBottom: '34px' }}>
              {gym.descripcion || 'Entrenamiento personalizado, plan nutricional y seguimiento real.'}
            </p>
            <a href={`https://wa.me/${gym.whatsapp?.replace(/\D/g, '') || ''}`} target="_blank" rel="noopener" className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '14px 28px', borderRadius: '999px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Reserva tu clase gratis</a>
          </div>
        </div>
      </section>

      {/* EJERCICIOS */}
      {ejercicios.length > 0 && (
        <section id="ejercicios" style={{ padding: '90px 0' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px' }}>Biblioteca de ejercicios</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {ejercicios.map((e: any) => (
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

      {/* VIDEOS */}
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

      {/* TESTIMONIOS */}
      <section id="testimonios" style={{ padding: '90px 0', background: '#0e0e10' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px', textAlign: 'center' }}>Lo que dicen nuestros alumnos</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '50px', maxWidth: '600px', textAlign: 'center', margin: '0 auto 50px' }}>Resultados reales. ¡Dejá tu opinión!</p>
          
          {testimonios && testimonios.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
              {testimonios.map((t: any) => (
                <div key={t.id} style={{ background: '#1e1e24', padding: '30px', borderRadius: '14px', border: '1px solid #2a2a32' }}>
                  <div style={{ color: 'var(--accent-2)', fontSize: '1.2rem', marginBottom: '15px' }}>{'⭐'.repeat(t.estrellas || 5)}</div>
                  <p style={{ color: '#d4d4d8', fontSize: '1rem', fontStyle: 'italic', marginBottom: '20px' }}>"{t.texto}"</p>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>— {t.nombre}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ maxWidth: '500px', margin: '0 auto', background: '#17171b', padding: '30px', borderRadius: '14px', border: '1px solid #2a2a32' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Dejá tu testimonio</h3>
            <TestimonioForm gymId={gym.id} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0c', padding: '60px 20px 30px', borderTop: '1px solid #26262c' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <div><div style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '10px' }}>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></div></div>
          <div><h4 style={{ marginBottom: '14px' }}>Contacto</h4><p style={{ color: '#a1a1aa', fontSize: '.92rem' }}>{gym.email_contacto}</p></div>
        </div>
      </footer>

      {/* MODAL DE VIDEO */}
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

function TestimonioForm({ gymId }: { gymId: string }) {
  const [nombre, setNombre] = useState('')
  const [texto, setTexto] = useState('')
  const [estrellas, setEstrellas] = useState('5')
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const supabase = createClient()

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('testimonios').insert({ gym_id: gymId, nombre: nombre.trim(), texto: texto.trim(), estrellas: Number(estrellas) })
    setLoading(false)
    if (error) { alert('Error: ' + error.message) } else {
      setOk(true); setNombre(''); setTexto(''); setEstrellas('5');
      setTimeout(() => setOk(false), 5000)
    }
  }

  return (
    <form onSubmit={enviar} style={{ display: 'grid', gap: '15px' }}>
      {ok && <div style={{ padding: '10px', background: 'rgba(34,197,94,.1)', color: '#4ade80', borderRadius: '8px', textAlign: 'center' }}>¡Gracias por tu opinión!</div>}
      <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0e0e10', border: '1px solid #2a2a32', color: '#fff' }} />
      <select value={estrellas} onChange={(e) => setEstrellas(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0e0e10', border: '1px solid #2a2a32', color: '#fff' }}>
        <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
        <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
        <option value="3">⭐⭐⭐ (3 estrellas)</option>
        <option value="2">⭐⭐ (2 estrellas)</option>
        <option value="1">⭐ (1 estrella)</option>
      </select>
      <textarea placeholder="Contanos tu experiencia..." value={texto} onChange={(e) => setTexto(e.target.value)} required rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0e0e10', border: '1px solid #2a2a32', color: '#fff', resize: 'vertical' }} />
      <button type="submit" disabled={loading} className="btn" style={{ width: '100%' }}>{loading ? 'Enviando...' : 'Publicar mi testimonio'}</button>
    </form>
  )
}

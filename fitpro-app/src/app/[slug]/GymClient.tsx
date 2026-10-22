'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPanel from './AdminPanel'

type Gym = any
type Item = any

export default function GymClient({
  gym, isOwner, servicios, ejercicios, rutinas, rutinaEjercicios, posts, videos, alimentos, testimonios, galeria
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
  galeria: Item[]
}) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null)

  const dynamicStyles = {
    '--accent': gym.color_primario || '#ff5a1f',
    '--accent-2': gym.color_secundario || '#ffb703',
  } as React.CSSProperties

  return (
    <div style={dynamicStyles}>
      
      {/* HEADER PÚBLICO ESTILO GLASSMORPHISM */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(9, 9, 11, 0.7)', // Fondo muy oscuro y transparente
        backdropFilter: 'blur(16px)',        // Efecto vidrio
        zIndex: 100, 
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease'
      }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', maxWidth: '1180px', margin: '0 auto' }}>
          
          {/* Logo */}
          <div style={{ fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', letterSpacing: '-0.5px' }}>
            {gym.logo_url ? (
              <img src={gym.logo_url} alt={gym.nombre} style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
              <span>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></span>
            )}
          </div>

          {/* Links */}
          <ul style={{ display: 'flex', gap: '25px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><a href="#sobre-mi" className="nav-link">Sobre mí</a></li>
            <li><a href="#galeria" className="nav-link">Galería</a></li>
            <li><a href="#ejercicios" className="nav-link">Ejercicios</a></li>
            <li><a href="#videos" className="nav-link">Videos</a></li>
            {testimonios.length > 0 && <li><a href="#testimonios" className="nav-link" style={{ color: 'var(--accent)' }}>Opiniones</a></li>}
          </ul>
        </nav>
      </header>

      {isOwner && (
        <div style={{ paddingTop: '72px' }}>
          <AdminPanel gym={gym} />
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight: isOwner ? '80vh' : '100vh', display: 'flex', alignItems: 'center', paddingTop: isOwner ? '150px' : '80px', background: gym.hero_img_url ? `linear-gradient(rgba(14,14,16,.6),rgba(14,14,16,.9)), url(${gym.hero_img_url}) center/cover` : 'linear-gradient(rgba(14,14,16,.6),rgba(14,14,16,.9)), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600) center/cover' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 900, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {gym.titulo_hero || 'Transforma tu cuerpo'} <br />
              <span style={{ color: 'var(--accent)' }}>{gym.subtitulo_hero || 'en 90 días'}</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#e4e4e7', marginBottom: '34px', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {gym.descripcion || 'Entrenamiento personalizado, plan nutricional y seguimiento real.'}
            </p>
            <a href={`https://wa.me/${gym.whatsapp?.replace(/\D/g, '') || ''}`} target="_blank" rel="noopener" className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>Reserva tu clase gratis</a>
          </div>
        </div>
      </section>

      {/* SOBRE MÍ */}
      {(gym.sobre_mi_img_url || gym.descripcion) && (
        <section id="sobre-mi" style={{ padding: '90px 0', background: '#09090b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '20px', fontWeight: 900 }}>
                Sobre <span style={{ color: 'var(--accent)' }}>mí</span>
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '20px' }}>
                {gym.descripcion || 'Conocé más sobre mi experiencia y cómo puedo ayudarte a alcanzar tus objetivos.'}
              </p>
            </div>
            {gym.sobre_mi_img_url && (
              <div>
                <img src={gym.sobre_mi_img_url} alt="Sobre mí" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', objectFit: 'cover', maxHeight: '500px' }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALERÍA DE FOTOS */}
      {galeria && galeria.length > 0 && (
        <section id="galeria" style={{ padding: '90px 0', background: '#17171b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '40px', textAlign: 'center', fontWeight: 900 }}>Nuestra Galería</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
              {galeria.map((foto: any) => (
                <div key={foto.id} onClick={() => setFotoSeleccionada(foto.url)} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '1/1', cursor: 'pointer', background: '#000', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={foto.url} alt={foto.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', opacity: 0.9 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 15px 15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                    {foto.titulo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EJERCICIOS */}
      {ejercicios.length > 0 && (
        <section id="ejercicios" style={{ padding: '90px 0', background: '#09090b' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px', fontWeight: 900 }}>Biblioteca de ejercicios</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {ejercicios.map((e: any) => (
                <div key={e.id} onClick={() => e.video_url && setVideoId(e.video_url)} style={{ background: 'rgba(23, 23, 27, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', cursor: e.video_url ? 'pointer' : 'default', transition: 'transform 0.2s, borderColor 0.2s' }} onMouseEnter={(ev) => { ev.currentTarget.style.transform = 'translateY(-4px)'; ev.currentTarget.style.borderColor = 'var(--accent)'; }} onMouseLeave={(ev) => { ev.currentTarget.style.transform = 'translateY(0)'; ev.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'rgba(255,90,31,.15)', color: 'var(--accent)', marginBottom: '12px' }}>{e.grupo_muscular}</span>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{e.nombre}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', color: '#a1a1aa', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', marginTop: '15px' }}>
                    <span>{e.equipamiento}</span>
                    <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>{e.dificultad}</span>
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
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px', fontWeight: 900 }}>Mi trabajo en acción</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {videos.map((v: any) => (
                <div key={v.id} onClick={() => v.youtube_id && setVideoId(v.youtube_id)} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/10', background: '#000', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/maxresdefault.jpg`} alt={v.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>▶</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIOS */}
      <section id="testimonios" style={{ padding: '90px 0', background: '#09090b' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px', textAlign: 'center', fontWeight: 900 }}>Lo que dicen nuestros alumnos</h2>
          <p style={{ color: '#a1a1aa', marginBottom: '50px', maxWidth: '600px', textAlign: 'center', margin: '0 auto 50px', fontSize: '1.1rem' }}>Resultados reales. ¡Dejá tu opinión!</p>
          
          {testimonios && testimonios.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
              {testimonios.map((t: any) => (
                <div key={t.id} style={{ background: 'rgba(23, 23, 27, 0.8)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--accent-2)', fontSize: '1.2rem', marginBottom: '15px' }}>{'⭐'.repeat(t.estrellas || 5)}</div>
                  <p style={{ color: '#e4e4e7', fontSize: '1rem', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>"{t.texto}"</p>
                  <div style={{ fontWeight: 700, color: 'var(--accent)' }}>— {t.nombre}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(23, 23, 27, 0.8)', padding: '35px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.3rem' }}>Dejá tu testimonio</h3>
            <TestimonioForm gymId={gym.id} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050505', padding: '60px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></div>
          <p style={{ color: '#71717a', fontSize: '.92rem' }}>{gym.email_contacto}</p>
        </div>
      </footer>

      {/* MODAL DE VIDEO */}
      {videoId && (
        <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', background: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <button onClick={() => setVideoId(null)} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 2, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', backdropFilter: 'blur(5px)' }}>✕</button>
            <div style={{ aspectRatio: '16/9', width: '100%' }}>
              <iframe src={`https://www.youtube.com/embed/${videoId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/)?.[1] || videoId}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE GALERÍA */}
      {fotoSeleccionada && (
        <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.95)', zIndex: 200, alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setFotoSeleccionada(null)}>
          <img src={fotoSeleccionada} alt="Foto" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} />
          <button onClick={() => setFotoSeleccionada(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
      )}

      {/* ESTILOS PARA LOS ENLACES DEL NAV */}
      <style jsx global>{`
        .nav-link {
          color: #a1a1aa;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: #fff;
          transform: translateY(-1px);
        }
      `}</style>
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
      {ok && <div style={{ padding: '12px', background: 'rgba(34,197,94,.15)', color: '#4ade80', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>¡Gracias por tu opinión!</div>}
      <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
      <select value={estrellas} onChange={(e) => setEstrellas(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}>
        <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
        <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
        <option value="3">⭐⭐⭐ (3 estrellas)</option>
        <option value="2">⭐⭐ (2 estrellas)</option>
        <option value="1">⭐ (1 estrella)</option>
      </select>
      <textarea placeholder="Contanos tu experiencia..." value={texto} onChange={(e) => setTexto(e.target.value)} required rows={3} style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', resize: 'vertical', outline: 'none' }} />
      <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '14px', borderRadius: '10px', fontWeight: 700 }}>{loading ? 'Enviando...' : 'Publicar mi testimonio'}</button>
    </form>
  )
}

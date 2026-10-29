'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminPanel from './AdminPanel'
import Link from 'next/link'
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
      
      {/* HEADER PÚBLICO */}
      <header style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, 
        background: 'rgba(9, 9, 11, 0.7)', backdropFilter: 'blur(16px)',        
        zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease'
      }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', letterSpacing: '-0.5px' }}>
            {gym.logo_url ? (
              <img src={gym.logo_url} alt={gym.nombre} style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
              <span>{gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span></span>
            )}
          </div>
          <ul style={{ display: 'flex', gap: '25px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
            <li><a href="#sobre-mi" className="nav-link">Sobre mí</a></li>
            <li><a href="#galeria" className="nav-link">Galería</a></li>
            <li><a href="#ejercicios" className="nav-link">Ejercicios</a></li>
            <li><a href="#videos" className="nav-link">Videos</a></li>
            {testimonios.length > 0 && <li><a href="#testimonios" className="nav-link" style={{ color: 'var(--accent)', fontWeight: 700 }}>Opiniones</a></li>}
          </ul>
        </nav>
      </header>

      {isOwner && (
        <div style={{ paddingTop: '72px' }}>
          <AdminPanel gym={gym} />
        </div>
      )}

      {/* HERO: Arreglado con flex-start y más padding para que no se corte */}
      <section id="home" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'flex-start', // 👈 Alineado arriba
        paddingTop: isOwner ? '220px' : '140px', // 👈 Más espacio
        paddingBottom: '80px',
        background: gym.hero_img_url ? `linear-gradient(rgba(9,9,11,.7),rgba(9,9,11,.95)), url(${gym.hero_img_url}) center/cover` : 'linear-gradient(rgba(9,9,11,.7),rgba(9,9,11,.95)), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600) center/cover' 
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '20px', fontWeight: 900, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
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
        <section id="sobre-mi" style={{ padding: '100px 0', background: '#09090b', scrollMarginTop: '120px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
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
                <img src={gym.sobre_mi_img_url} alt="Sobre mí" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', objectFit: 'cover', maxHeight: '500px', border: '1px solid rgba(255,255,255,0.05)' }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* GALERÍA DE FOTOS (Arreglado el scrollMarginTop para que no la tape el menú) */}
      {galeria && galeria.length > 0 && (
        <section id="galeria" style={{ padding: '100px 0', background: '#0e0e10', scrollMarginTop: '120px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '40px', textAlign: 'center', fontWeight: 900 }}>
              Nuestra <span style={{ color: 'var(--accent)' }}>Galería</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {galeria.map((foto: any) => (
                <div 
                  key={foto.id} 
                  onClick={() => setFotoSeleccionada(foto.url)} 
                  style={{ 
                    position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '1/1', cursor: 'pointer', 
                    background: '#000', border: '2px solid transparent', transition: 'border-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
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
        <section id="ejercicios" style={{ padding: '100px 0', background: '#09090b', scrollMarginTop: '120px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px', fontWeight: 900 }}>
              Biblioteca de <span style={{ color: 'var(--accent)' }}>Ejercicios</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {ejercicios.map((e: any) => (
                <div key={e.id} onClick={() => e.video_url && setVideoId(e.video_url)} style={{ background: 'rgba(23, 23, 27, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', cursor: e.video_url ? 'pointer' : 'default', transition: 'transform 0.2s, borderColor 0.2s' }} onMouseEnter={(ev) => { ev.currentTarget.style.transform = 'translateY(-4px)'; ev.currentTarget.style.borderColor = 'var(--accent)'; }} onMouseLeave={(ev) => { ev.currentTarget.style.transform = 'translateY(0)'; ev.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                  <span style={{ display: 'inline-block', fontSize: '.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', background: 'rgba(255,255,255,0.05)', color: 'var(--accent)', marginBottom: '12px', border: '1px solid var(--accent)' }}>{e.grupo_muscular}</span>
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
        <section id="videos" style={{ padding: '100px 0', background: '#0e0e10', scrollMarginTop: '120px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '30px', fontWeight: 900 }}>
              Mi trabajo en <span style={{ color: 'var(--accent)' }}>acción</span>
            </h2>
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
      <section id="testimonios" style={{ padding: '100px 0', background: '#09090b', scrollMarginTop: '120px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '14px', textAlign: 'center', fontWeight: 900 }}>
            Lo que dicen nuestros <span style={{ color: 'var(--accent)' }}>alumnos</span>
          </h2>
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

            {/* FOOTER DINÁMICO */}
      <footer style={{ background: '#050505', padding: '60px 20px 30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
          
          {/* Columna 1: Logo y Descripción */}
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '15px', color: '#fff' }}>
              {gym.nombre} <span style={{ color: 'var(--accent)' }}>{gym.sufijo}</span>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {gym.descripcion || 'Entrenamiento personal y transformación real.'}
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {gym.instagram && (
                <a href={`https://instagram.com/${gym.instagram.replace('@', '')}`} target="_blank" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              )}
              {gym.youtube && (
                <a href={`https://youtube.com/${gym.youtube}`} target="_blank" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              )}
              {gym.tiktok && (
                <a href={`https://tiktok.com/${gym.tiktok}`} target="_blank" style={{ color: '#a1a1aa', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Contacto */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>Contacto</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gym.direccion && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#a1a1aa', fontSize: '0.95rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>{gym.direccion}, {gym.ciudad}, {gym.pais}</span>
                </div>
              )}
              {gym.telefono && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a1a1aa', fontSize: '0.95rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{gym.telefono}</span>
                </div>
              )}
              {gym.email_contacto && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a1a1aa', fontSize: '0.95rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>{gym.email_contacto}</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna 3: Horarios o Llamado a la acción */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700 }}>¿Listo para entrenar?</h4>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Reservá tu primera sesión y empezá tu transformación hoy mismo.
            </p>
            {gym.whatsapp && (
              <a 
                href={`https://wa.me/${gym.whatsapp.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener" 
                className="btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Escribir por WhatsApp
              </a>
            )}
          </div>
        </div>

        <div style={{ maxWidth: '1180px', margin: '40px auto 0', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <p style={{ color: '#52525b', fontSize: '0.85rem' }}>© {new Date().getFullYear()} {gym.nombre}. Todos los derechos reservados.</p>
          <Link href="/login" style={{ color: '#52525b', fontSize: '0.85rem', textDecoration: 'none' }}>Acceso Entrenadores</Link>
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
      <button type="submit" disabled={loading} className="btn" style={{ width: '100%', padding: '14px', borderRadius: '10px', fontWeight: 700, background: 'var(--accent)' }}>{loading ? 'Enviando...' : 'Publicar mi testimonio'}</button>
    </form>
  )
}

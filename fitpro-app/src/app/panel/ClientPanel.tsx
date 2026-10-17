'use client'

import { useState } from 'react'

export default function ClientPanel({ user, gym, ejercicios, videos, rutinaAsignada, detalleRutina }: any) {
  const [videoId, setVideoId] = useState<string | null>(null)

  const getIdYoutube = (url: string) => {
    if (!url) return ''
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : url
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Cerrar sesión</button>
            </form>
          </div>
        </header>
        
        <div style={{ marginBottom: '50px' }}>
          <h1 className="section-title">Hola de nuevo 👋</h1>
          <p className="section-sub" style={{ marginBottom: '10px' }}>Bienvenido a <strong style={{ color: 'var(--accent)' }}>{gym?.nombre} {gym?.sufijo}</strong></p>
          <p style={{ color: 'var(--muted)' }}><strong>{user.email}</strong></p>
        </div>

        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🏋️ Tu rutina asignada</h2>
        {rutinaAsignada ? (
          <div className="rutina-card" style={{ marginBottom: '50px', borderColor: 'var(--accent)' }}>
            <span className="badge-nivel">{rutinaAsignada.nivel}</span>
            <h3>{rutinaAsignada.nombre}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>🎯 {rutinaAsignada.objetivo}</p>
            
            <div style={{ marginTop: '20px', background: 'var(--bg-2)', padding: '20px', borderRadius: '10px' }}>
              <h4 style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '10px' }}>EJERCICIOS</h4>
              {detalleRutina.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {detalleRutina.map((ej: any, index: number) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #2a2a32', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{ej.ejercicios?.nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Día {ej.dia} · {ej.ejercicios?.grupo_muscular}</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                        <div><strong style={{ color: 'var(--accent-2)' }}>{ej.series}</strong> series x <strong style={{ color: 'var(--accent-2)' }}>{ej.repeticiones}</strong></div>
                        {ej.notas && <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{ej.notas}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--muted)' }}>Los ejercicios se están preparando.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="service-card" style={{ marginBottom: '50px', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)' }}>Tu entrenador todavía no te asignó una rutina.</p>
          </div>
        )}

        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>📋 Ejercicios de tu gym</h2>
        <div className="ejercicios-grid" style={{ marginBottom: '50px' }}>
          {ejercicios.map((e: any) => (
            <div key={e.id} className="ejercicio-card" onClick={() => e.video_url && setVideoId(e.video_url)} style={{ cursor: e.video_url ? 'pointer' : 'default' }}>
              <span className="tag">{e.grupo_muscular}</span>
              <h3>{e.nombre}</h3>
              <div className="ejercicio-meta" style={{ marginTop: '10px' }}>
                <span><strong>{e.dificultad}</strong></span>
                {e.video_url && <span style={{ color: 'var(--accent)' }}>▶ Ver video</span>}
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🎥 Videos de tu gym</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {videos.map((v: any) => (
            <div key={v.id} className="service-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setVideoId(v.youtube_id)}>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{v.titulo}</h3>
              <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>▶ Ver video</p>
            </div>
          ))}
        </div>

        {/* MODAL DE VIDEO */}
        {videoId && (
          <div className="modal open" onClick={(ev) => { if (ev.target === ev.currentTarget) setVideoId(null) }}>
            <div className="modal-content">
              <button className="modal-close" onClick={() => setVideoId(null)}>✕</button>
              <div className="modal-video">
                <iframe src={`https://www.youtube.com/embed/${getIdYoutube(videoId)}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

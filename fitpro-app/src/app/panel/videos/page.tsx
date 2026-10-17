'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Video = {
  id: string
  titulo: string
  descripcion: string | null
  youtube_id: string | null
  thumbnail_url: string | null
  orden: number | null
  activo: boolean | null
}

export default function VideosPage() {
  const router = useRouter()
  const supabase = createClient()

  const [videos, setVideos] = useState<Video[]>([])
  const [cargando, setCargando] = useState(true)
  const [videoAbierto, setVideoAbierto] = useState<Video | null>(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('videos')
        .select('*')
        .eq('activo', true)
        .order('orden')

      setVideos(data ?? [])
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function eliminar(id: string, titulo: string) {
    const confirmado = confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)
    if (!confirmado) return

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  function getThumbnail(video: Video) {
    if (video.thumbnail_url) return video.thumbnail_url
    if (video.youtube_id) return `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
    return ''
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        {/* Header */}
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>
              FIT<span>PRO</span>
            </Link>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/panel/videos/nuevo" className="btn btn-sm">
                ➕ Nuevo video
              </Link>
              <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                ← Volver al panel
              </Link>
            </div>
          </div>
        </header>

        {/* Título */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Videos</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Tenés <strong style={{ color: 'var(--accent)' }}>{videos.length}</strong> videos cargados.
            Hacé clic en cualquiera para verlo.
          </p>
        </div>

        {/* Estado de carga */}
        {cargando ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>
            Cargando videos...
          </p>
        ) : videos.length === 0 ? (
          <div className="service-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              Todavía no cargaste ningún video.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
            {videos.map((v) => (
              <div
                key={v.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid #2a2a32',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Miniatura + play (clickeable para abrir modal) */}
                <div
                  onClick={() => setVideoAbierto(v)}
                  style={{ position: 'relative', aspectRatio: '16/9', background: '#000', overflow: 'hidden', cursor: 'pointer' }}
                >
                  {getThumbnail(v) ? (
                    <img
                      src={getThumbnail(v)}
                      alt={v.titulo}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                      Sin miniatura
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: '#fff',
                    textShadow: '0 2px 10px rgba(0,0,0,.8)'
                  }}>
                    ▶
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{v.titulo}</h3>
                  {v.descripcion && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
                      {v.descripcion}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #2a2a32', padding: '12px' }}>
                  <Link
                    href={`/panel/videos/editar/${v.id}`}
                    className="btn btn-sm"
                    style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '8px' }}
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => eliminar(v.id, v.titulo)}
                    className="btn btn-sm"
                    style={{
                      flex: 1,
                      fontSize: '0.8rem',
                      padding: '8px',
                      background: 'transparent',
                      border: '1px solid #e64a10',
                      color: '#e64a10',
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {videoAbierto && (
        <div
          className="modal open"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setVideoAbierto(null)
          }}
        >
          <div className="modal-content" style={{ background: '#141418' }}>
            <button className="modal-close" onClick={() => setVideoAbierto(null)}>
              ✕
            </button>

            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                {videoAbierto.titulo}
              </h2>
              {videoAbierto.descripcion && (
                <p style={{ color: 'var(--muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
                  {videoAbierto.descripcion}
                </p>
              )}

              {videoAbierto.youtube_id ? (
                <div className="modal-video" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoAbierto.youtube_id}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
                  />
                </div>
              ) : (
                <div style={{ padding: '30px', background: 'var(--bg-2)', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--muted)' }}>
                    Este video no tiene ID de YouTube cargado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

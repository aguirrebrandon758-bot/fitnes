'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Ejercicio = {
  id: string
  nombre: string
  descripcion: string | null
  grupo_muscular: string | null
  dificultad: string | null
  equipamiento: string | null
  video_url: string | null
}

export default function EjerciciosPage() {
  const router = useRouter()
  const supabase = createClient()

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])
  const [cargando, setCargando] = useState(true)
  const [videoAbierto, setVideoAbierto] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('ejercicios')
        .select('*')
        .order('nombre')

      setEjercicios(data ?? [])
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function eliminar(id: string, nombre: string) {
    const confirmado = confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)
    if (!confirmado) return

    const { error } = await supabase
      .from('ejercicios')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    setEjercicios((prev) => prev.filter((e) => e.id !== id))
  }

  function getIdYoutube(url: string) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : url
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
              <Link href="/panel/ejercicios/nuevo" className="btn btn-sm">
                ➕ Nuevo ejercicio
              </Link>
              <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                ← Volver al panel
              </Link>
            </div>
          </div>
        </header>

        {/* Título */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Ejercicios</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Tenés <strong style={{ color: 'var(--accent)' }}>{ejercicios.length}</strong> ejercicios cargados.
          </p>
        </div>

        {/* Estado de carga */}
        {cargando ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>
            Cargando ejercicios...
          </p>
        ) : ejercicios.length === 0 ? (
          <div className="service-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              Todavía no cargaste ningún ejercicio.
            </p>
          </div>
        ) : (
          <div className="ejercicios-grid">
            {ejercicios.map((e) => (
              <div
                key={e.id}
                className="ejercicio-card"
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div
                  onClick={() => e.video_url && setVideoAbierto(e.video_url)}
                  style={{ cursor: e.video_url ? 'pointer' : 'default', flex: 1 }}
                >
                  <span className="tag">{e.grupo_muscular}</span>
                  <h3>{e.nombre}</h3>
                  {e.descripcion && <p>{e.descripcion}</p>}
                  <div className="ejercicio-meta">
                    <span>{e.equipamiento}</span>
                    <span><strong>{e.dificultad}</strong></span>
                  </div>
                  {e.video_url && (
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--accent)' }}>
                      ▶ Ver video
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #2a2a32', paddingTop: '12px' }}>
                  <Link
                    href={`/panel/ejercicios/editar/${e.id}`}
                    className="btn btn-sm"
                    style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '8px' }}
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => eliminar(e.id, e.nombre)}
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

      {/* Modal de video */}
      {videoAbierto && (
        <div
          className="modal open"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setVideoAbierto(null)
          }}
        >
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setVideoAbierto(null)}
            >
              ✕
            </button>
            <div className="modal-video">
              <iframe
                src={`https://www.youtube.com/embed/${getIdYoutube(videoAbierto)}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

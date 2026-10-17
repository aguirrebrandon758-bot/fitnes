'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevoVideoPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gymId, setGymId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [youtubeId, setYoutubeId] = useState('')

  // Extrae el ID de YouTube de una URL completa
  function extraerYoutubeId(input: string) {
    const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : input.trim()
  }

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: gym } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (!gym) {
        setError('No tenés un gym asignado.')
        setCargando(false)
        return
      }

      setGymId(gym.id)
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!gymId || !titulo.trim() || !youtubeId.trim()) {
      setError('Completá el título y el video de YouTube.')
      return
    }

    setGuardando(true)

    const idYoutube = extraerYoutubeId(youtubeId)

    const { error: insertError } = await supabase
      .from('videos')
      .insert({
        gym_id: gymId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        youtube_id: idYoutube,
        activo: true,
      })

    if (insertError) {
      setError('Error: ' + insertError.message)
      setGuardando(false)
      return
    }

    router.push('/panel/videos')
    router.refresh()
  }

  if (cargando) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container">
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>
              FIT<span>PRO</span>
            </Link>
            <Link href="/panel/videos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
              ← Volver a videos
            </Link>
          </div>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Nuevo video</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Pegá el link de YouTube y los datos del video.
          </p>
        </div>

        <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label>Título *</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Técnica de sentadilla"
                required
              />
            </div>

            <div>
              <label>Descripción</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción del video..."
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #2a2a32',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  width: '100%',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label>URL o ID de YouTube *</label>
              <input
                type="text"
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=XXXXX o solo XXXXX"
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '5px' }}>
                Podés pegar el link completo o solo el ID del video.
              </p>
            </div>
          </div>

          {error && (
            <div style={{ padding: '14px', borderRadius: '10px', marginTop: '20px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
            <button type="submit" className="btn" disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar video'}
            </button>
            <Link href="/panel/videos" className="btn btn-outline">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

function EditarVideoForm() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const id = params.id as string

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [youtubeId, setYoutubeId] = useState('')

  function extraerYoutubeId(input: string) {
    const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : input.trim()
  }

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (!gym) { setError('No tenés un gym asignado.'); setCargando(false); return }

      const { data: v, error: err } = await supabase.from('videos').select('*').eq('id', id).eq('gym_id', gym.id).maybeSingle()
      if (err || !v) { setError('Video no encontrado o no te pertenece.'); setCargando(false); return }

      setTitulo(v.titulo || '')
      setDescripcion(v.descripcion || '')
      setYoutubeId(v.youtube_id || '')
      setCargando(false)
    }
    cargar()
  }, [id, router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!titulo.trim() || !youtubeId.trim()) { setError('Completá el título y el video de YouTube.'); return }

    setGuardando(true)
    const { error: upError } = await supabase.from('videos').update({
        titulo: titulo.trim(), descripcion: descripcion.trim() || null, youtube_id: extraerYoutubeId(youtubeId),
      }).eq('id', id)

    if (upError) { setError('Error: ' + upError.message); setGuardando(false); return }
    router.push('/panel/videos'); router.refresh()
  }

  if (cargando) return <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}><div className="container"><p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p></div></div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
            <Link href="/panel/videos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver</Link>
          </div>
        </header>
        <div style={{ marginBottom: '40px' }}><h1 className="section-title">Editar video</h1></div>
        {error && !titulo ? (
          <div className="service-card" style={{ padding: '30px', borderColor: '#e64a10' }}><p style={{ color: '#fca5a5' }}>{error}</p><Link href="/panel/videos" className="btn btn-sm" style={{ marginTop: '20px' }}>Volver</Link></div>
        ) : (
          <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
            <div style={{ display: 'grid', gap: '18px' }}>
              <div><label>Título *</label><input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required /></div>
              <div><label>Descripción</label><textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #2a2a32', background: 'var(--card)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '1rem', width: '100%', resize: 'vertical' }} /></div>
              <div><label>URL o ID de YouTube *</label><input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} required /></div>
            </div>
            {error && <div style={{ padding: '14px', borderRadius: '10px', marginTop: '20px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', color: '#fca5a5' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
              <button type="submit" className="btn" disabled={guardando}>{guardando ? 'Guardando...' : '💾 Guardar cambios'}</button>
              <Link href="/panel/videos" className="btn btn-outline">Cancelar</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function EditarVideoPage() {
  return (
    <Suspense fallback={<div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}><div className="container"><p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p></div></div>}>
      <EditarVideoForm />
    </Suspense>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react' // 👈 Agregamos useRef
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GaleriaPage() {
  const router = useRouter()
  const supabase = createClient()
  
  // 👇 Creamos la referencia al input oculto 👇
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [gymId, setGymId] = useState<string | null>(null)
  const [fotos, setFotos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [titulo, setTitulo] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (gym) {
        setGymId(gym.id)
        const { data } = await supabase.from('galeria').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false })
        setFotos(data || [])
      }
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !gymId) return

    setSubiendo(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `galeria-${gymId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('imagenes').upload(fileName, file)
    
    if (uploadError) {
      alert('Error al subir: ' + uploadError.message)
      setSubiendo(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName)

    const { data, error: dbError } = await supabase.from('galeria').insert({
      gym_id: gymId,
      url: publicUrl,
      titulo: titulo.trim() || 'Foto del gimnasio'
    }).select().single()

    if (dbError) {
      alert('Error al guardar: ' + dbError.message)
    } else {
      setFotos(prev => [data, ...prev])
      setTitulo('')
      // Limpiamos el input para poder subir la misma foto de nuevo si queremos
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    setSubiendo(false)
  }

  async function eliminarFoto(id: string) {
    if (!confirm('¿Eliminar esta foto?')) return
    await supabase.from('galeria').delete().eq('id', id)
    setFotos(prev => prev.filter(f => f.id !== id))
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff', background: '#0e0e10', minHeight: '100vh' }}>Cargando...</div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
          <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver al panel</Link>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Galería de Fotos</h1>
          <p className="section-sub">Subí fotos de tu gimnasio, tus entrenamientos y tus alumnos. Se van a mostrar en tu página pública.</p>
        </div>

        <div className="service-card" style={{ padding: '30px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Título de la foto (opcional)</label>
            <input type="text" placeholder="Ej: Nuestro gym" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-2)', border: '1px solid #2a2a32', color: '#fff' }} />
          </div>
          <div>
            {/* Input invisible */}
            <input type="file" accept="image/*" onChange={subirFoto} disabled={subiendo} style={{ display: 'none' }} ref={fileInputRef} />
            {/* Botón que activa el input */}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={subiendo}
              className="btn" 
              style={{ cursor: 'pointer', padding: '12px 24px' }}
            >
              {subiendo ? 'Subiendo...' : '📸 Subir Foto'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {fotos.map(foto => (
            <div key={foto.id} style={{ background: 'var(--card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a32', position: 'relative' }}>
              <img src={foto.url} alt={foto.titulo} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{foto.titulo}</span>
                <button onClick={() => eliminarFoto(foto.id)} style={{ background: 'transparent', border: 'none', color: '#e64a10', cursor: 'pointer', fontSize: '1.1rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TestimoniosPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gymId, setGymId] = useState<string | null>(null)
  const [testimonios, setTestimonios] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  
  const [nombre, setNombre] = useState('')
  const [texto, setTexto] = useState('')
  const [estrellas, setEstrellas] = useState('5')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (gym) {
        setGymId(gym.id)
        const { data } = await supabase.from('testimonios').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false })
        setTestimonios(data || [])
      }
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!gymId) return
    setGuardando(true)

    const { error } = await supabase.from('testimonios').insert({
      gym_id: gymId,
      nombre: nombre.trim(),
      texto: texto.trim(),
      estrellas: Number(estrellas)
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setNombre('')
      setTexto('')
      setEstrellas('5')
      const { data } = await supabase.from('testimonios').select('*').eq('gym_id', gymId).order('creado_en', { ascending: false })
      setTestimonios(data || [])
    }
    setGuardando(false)
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este testimonio?')) return
    await supabase.from('testimonios').delete().eq('id', id)
    setTestimonios(prev => prev.filter(t => t.id !== id))
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
          <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver al panel</Link>
        </header>

        <h1 className="section-title">Testimonios</h1>
        <p className="section-sub" style={{ marginBottom: '30px' }}>Agregá opiniones de tus alumnos para mostrar en tu página pública.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="service-card" style={{ padding: '25px', alignSelf: 'start' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--accent)' }}>➕ Nuevo Testimonio</h3>
            <form onSubmit={guardar} style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label>Nombre del alumno</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Juan Pérez" required />
              </div>
              <div>
                <label>Estrellas (1 a 5)</label>
                <select value={estrellas} onChange={(e) => setEstrellas(e.target.value)}>
                  <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option value="4">⭐⭐⭐⭐ (4)</option>
                  <option value="3">⭐⭐⭐ (3)</option>
                  <option value="2">⭐⭐ (2)</option>
                  <option value="1">⭐ (1)</option>
                </select>
              </div>
              <div>
                <label>Testimonio</label>
                <textarea rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej: Bajé 10 kilos en 3 meses..." required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #2a2a32', background: 'var(--card)', color: '#fff', width: '100%', resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar Testimonio'}</button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: '20px' }}>Tus Testimonios ({testimonios.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {testimonios.map(t => (
                <div key={t.id} style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '10px', borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{t.nombre}</strong>
                    <button onClick={() => eliminar(t.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                  </div>
                  <div style={{ color: 'var(--accent-2)', marginBottom: '10px', fontSize: '0.9rem' }}>
                    {'⭐'.repeat(t.estrellas)}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>"{t.texto}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

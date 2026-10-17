'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DietasPage() {
  const router = useRouter()
  const supabase = createClient()
  const [dietas, setDietas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (gym) {
        const { data } = await supabase.from('dietas').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false })
        setDietas(data || [])
      }
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta dieta? Los clientes que la tengan asignada quedarán sin plan.')) return
    await supabase.from('dietas').delete().eq('id', id)
    setDietas(prev => prev.filter(d => d.id !== id))
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/panel/dietas/nuevo" className="btn btn-sm">➕ Nueva Dieta</Link>
            <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver al panel</Link>
          </div>
        </header>

        <h1 className="section-title">Planes de Alimentación</h1>
        <p className="section-sub" style={{ marginBottom: '30px' }}>Creá guías para perder peso, ganar masa o déficit.</p>

        <div className="services-grid">
          {dietas.map(d => (
            <div key={d.id} className="service-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="tag">{d.tipo}</span>
              <h3 style={{ marginTop: '10px' }}>{d.nombre}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', flex: 1, marginTop: '10px', whiteSpace: 'pre-wrap' }}>{d.descripcion || 'Sin instrucciones detalladas.'}</p>
              <button onClick={() => eliminar(d.id)} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #e64a10', color: '#e64a10', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>🗑️ Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

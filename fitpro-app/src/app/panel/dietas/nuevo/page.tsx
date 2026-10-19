'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevaDietaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gymId, setGymId] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('Perder peso')
  const [descripcion, setDescripcion] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (gym) setGymId(gym.id)
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!gymId) return
    setGuardando(true)

    const { error } = await supabase.from('dietas').insert({
      gym_id: gymId,
      nombre: nombre.trim(),
      tipo: tipo,
      descripcion: descripcion.trim()
    })

    if (error) { alert('Error: ' + error.message); setGuardando(false); return }
    router.push('/panel/dietas')
    router.refresh()
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
          <Link href="/panel/dietas" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver a dietas</Link>
        </header>

        <h1 className="section-title">Nueva Guía de Alimentos</h1>
        <p className="section-sub">Creá un plan nutricional para tus alumnos.</p>

        <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label>Nombre del plan *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Déficit Calórico - 1500 kcal" required />
            </div>
            <div>
              <label>Tipo de Dieta</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Perder peso</option>
                <option>Ganar peso</option>
                <option>Ganar masa muscular</option>
                <option>Déficit calórico</option>
                <option>Mantenimiento</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label>Instrucciones / Menú (opcional)</label>
              <textarea rows={5} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Desayuno: 3 huevos y avena. Almuerzo: 200g de pollo..." style={{ padding: '12px', borderRadius: '10px', border: '1px solid #2a2a32', background: 'var(--card)', color: '#fff', width: '100%', resize: 'vertical' }} />
            </div>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '30px' }} disabled={guardando}>
            {guardando ? 'Guardando...' : '💾 Guardar Dieta'}
          </button>
        </form>
      </div>
    </div>
  )
}

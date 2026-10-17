'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ClientesPage() {
  const router = useRouter()
  const supabase = createClient()

  const [clientes, setClientes] = useState<any[]>([])
  const [rutinas, setRutinas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (!gym) { router.push('/panel'); return }

      // Cargar rutinas del gym
      const { data: rut } = await supabase.from('rutinas').select('*').eq('gym_id', gym.id)
      setRutinas(rut || [])

      // Cargar clientes con sus perfiles y rutinas asignadas
      const { data: cli } = await supabase
        .from('gym_clientes')
        .select(`
          id,
          user_id,
          rutina_asignada_id,
          profiles (email, nombre),
          rutinas (nombre)
        `)
        .eq('gym_id', gym.id)

      setClientes(cli || [])
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function asignarRutina(clienteId: string, rutinaId: string) {
    setGuardando(clienteId)
    const { error } = await supabase
      .from('gym_clientes')
      .update({ rutina_asignada_id: rutinaId || null })
      .eq('id', clienteId)

    if (!error) {
      // Actualizar la lista localmente
      setClientes(prev => prev.map(c => 
        c.id === clienteId ? { ...c, rutina_asignada_id: rutinaId || null } : c
      ))
    } else {
      alert('Error al asignar rutina')
    }
    setGuardando(null)
  }

  if (cargando) return <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px' }}><p>Cargando...</p></div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
          <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver al panel</Link>
        </header>

        <h1 className="section-title">Gestión de Clientes</h1>
        <p className="section-sub" style={{ marginBottom: '30px' }}>Asigná una rutina a cada alumno.</p>

        <div className="tabla-wrapper" style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid #2a2a32', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#141418', color: 'var(--muted)', textAlign: 'left', fontSize: '0.85rem' }}>
                <th style={{ padding: '16px' }}>Cliente</th>
                <th style={{ padding: '16px' }}>Rutina Asignada</th>
                <th style={{ padding: '16px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>Todavía no tenés clientes unidos.</td></tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #2a2a32' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 'bold' }}>{(c.profiles as any)?.nombre || 'Sin nombre'}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{(c.profiles as any)?.email}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select 
                        value={c.rutina_asignada_id || ''} 
                        onChange={(e) => asignarRutina(c.id, e.target.value)}
                        disabled={guardando === c.id}
                        style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-2)', color: '#fff', border: '1px solid #444' }}
                      >
                        <option value="">Sin asignar</option>
                        {rutinas.map(r => (
                          <option key={r.id} value={r.id}>{r.nombre}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {guardando === c.id ? 'Guardando...' : (c.rutina_asignada_id ? '✅ Asignada' : '⏳ Pendiente')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

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
  const [dietas, setDietas] = useState<any[]>([])
  const [gymId, setGymId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState<string | null>(null)

  // Estado para el acordeón en celular
  const [expandedCliente, setExpandedCliente] = useState<string | null>(null)

  // Estados para agregar alumno
  const [nuevoEmail, setNuevoEmail] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [mensajeNuevo, setMensajeNuevo] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (!gym) { router.push('/panel'); return }

      setGymId(gym.id)

      const [{ data: rut }, { data: diet }] = await Promise.all([
        supabase.from('rutinas').select('*').eq('gym_id', gym.id),
        supabase.from('dietas').select('*').eq('gym_id', gym.id)
      ])
      
      setRutinas(rut || [])
      setDietas(diet || [])

      cargarClientes(gym.id)
    }
    cargar()
  }, [router, supabase])

  async function cargarClientes(gId: string) {
    const { data: cli } = await supabase
      .from('gym_clientes')
      .select(`id, user_id, rutina_asignada_id, dieta_asignada_id, profiles (email, nombre)`)
      .eq('gym_id', gId)

    setClientes(cli || [])
    setCargando(false)
  }

  async function agregarAlumno(e: React.FormEvent) {
    e.preventDefault()
    if (!gymId || !nuevoEmail) return

    setAgregando(true)
    setMensajeNuevo('')

    const { data: userId, error: rpcError } = await supabase.rpc('get_user_id_by_email', { email_input: nuevoEmail.trim() })

    if (rpcError || !userId) {
      setMensajeNuevo('❌ El alumno no existe. Pedile que se registre primero.')
      setAgregando(false)
      return
    }

    const { data: existente } = await supabase
      .from('gym_clientes')
      .select('id')
      .eq('gym_id', gymId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existente) {
      setMensajeNuevo('⚠️ Este alumno ya está en tu gimnasio.')
      setAgregando(false)
      return
    }

    const { error: insertError } = await supabase
      .from('gym_clientes')
      .insert({ gym_id: gymId, user_id: userId, activo: true })

    if (insertError) {
      setMensajeNuevo('❌ Error: ' + insertError.message)
    } else {
      setMensajeNuevo('✅ Alumno agregado correctamente.')
      setNuevoEmail('')
      cargarClientes(gymId)
    }
    setAgregando(false)
    setTimeout(() => setMensajeNuevo(''), 5000)
  }

  async function asignarRutina(clienteId: string, rutinaId: string) {
    setGuardando(clienteId)
    const { error } = await supabase.from('gym_clientes').update({ rutina_asignada_id: rutinaId || null }).eq('id', clienteId)
    if (!error) setClientes(prev => prev.map(c => c.id === clienteId ? { ...c, rutina_asignada_id: rutinaId || null } : c))
    setGuardando(null)
  }

  async function asignarDieta(clienteId: string, dietaId: string) {
    setGuardando(clienteId)
    const { error } = await supabase.from('gym_clientes').update({ dieta_asignada_id: dietaId || null }).eq('id', clienteId)
    if (!error) setClientes(prev => prev.map(c => c.id === clienteId ? { ...c, dieta_asignada_id: dietaId || null } : c))
    setGuardando(null)
  }

  async function eliminarAlumno(clienteId: string, email: string) {
    if (!confirm(`¿Estás seguro que querés eliminar a ${email} de tu gimnasio?`)) return
    setGuardando(clienteId)
    await supabase.from('gym_clientes').delete().eq('id', clienteId)
    setClientes(prev => prev.filter(c => c.id !== clienteId))
    setGuardando(null)
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>

  return (
    <div className="page-container">
      
      <div style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Gestión de Clientes</h1>
        <p className="section-sub">Asigná rutinas y planes de alimentación a tus alumnos.</p>
      </div>

      {/* Formulario para agregar alumno */}
      <div className="service-card" style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Agregar alumno por Email</label>
          <input 
            type="email" placeholder="email@alumno.com" value={nuevoEmail} onChange={e => setNuevoEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-2)', border: '1px solid #2a2a32', color: '#fff' }}
          />
        </div>
        <button onClick={agregarAlumno} disabled={agregando} className="btn" style={{ padding: '12px 24px' }}>
          {agregando ? 'Buscando...' : '➕ Agregar Alumno'}
        </button>
      </div>
      
      {mensajeNuevo && (
        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', background: mensajeNuevo.includes('✅') ? 'rgba(34,197,94,.1)' : 'rgba(230,74,16,.1)', color: mensajeNuevo.includes('✅') ? '#86efac' : '#fca5a5', border: `1px solid ${mensajeNuevo.includes('✅') ? '#22c55e' : '#e64a10'}` }}>
          {mensajeNuevo}
        </div>
      )}

      {/* ================= VISTA DE ESCRITORIO (TABLA) ================= */}
      <div className="desktop-table tabla-wrapper" style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid #2a2a32', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#141418', color: 'var(--muted)', textAlign: 'left', fontSize: '0.85rem' }}>
              <th style={{ padding: '16px' }}>Cliente</th>
              <th style={{ padding: '16px' }}>Rutina Asignada</th>
              <th style={{ padding: '16px' }}>Dieta Asignada</th>
              <th style={{ padding: '16px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>Todavía no tenés clientes unidos.</td></tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #2a2a32' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 'bold' }}>{(c.profiles as any)?.nombre || 'Sin nombre'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{(c.profiles as any)?.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select value={c.rutina_asignada_id || ''} onChange={(e) => asignarRutina(c.id, e.target.value)} disabled={guardando === c.id} style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-2)', color: '#fff', border: '1px solid #444', width: '100%', maxWidth: '200px' }}>
                      <option value="">Sin asignar</option>
                      {rutinas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select value={c.dieta_asignada_id || ''} onChange={(e) => asignarDieta(c.id, e.target.value)} disabled={guardando === c.id} style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-2)', color: '#fff', border: '1px solid #444', width: '100%', maxWidth: '200px' }}>
                      <option value="">Sin asignar</option>
                      {dietas.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button onClick={() => eliminarAlumno(c.id, (c.profiles as any)?.email)} disabled={guardando === c.id} style={{ background: 'transparent', border: '1px solid #e64a10', color: '#e64a10', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      🗑️ Quitar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VISTA DE CELULAR (ACORDEÓN) ================= */}
      <div className="mobile-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {clientes.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>Todavía no tenés clientes unidos.</div>
        ) : (
          clientes.map((c) => {
            const isExpanded = expandedCliente === c.id

            return (
              <div key={c.id} style={{ background: 'var(--card)', borderRadius: '16px', border: `1px solid ${isExpanded ? 'var(--accent)' : '#2a2a32'}`, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                
                {/* Cabecera del acordeón (Clickeable) */}
                <div 
                  onClick={() => setExpandedCliente(isExpanded ? null : c.id)}
                  style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#fff' }}>
                      {(c.profiles as any)?.nombre || 'Sin nombre'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {(c.profiles as any)?.email}
                    </div>
                  </div>
                  <div style={{ color: isExpanded ? 'var(--accent)' : '#a1a1aa', transition: 'transform 0.3s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▼
                  </div>
                </div>

                {/* Contenido desplegable */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    
                    <div style={{ marginTop: '15px' }}>
                      <label style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>Rutina Asignada</label>
                      <select value={c.rutina_asignada_id || ''} onChange={(e) => asignarRutina(c.id, e.target.value)} disabled={guardando === c.id} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0e0e10', color: '#fff', border: '1px solid #444' }}>
                        <option value="">Sin asignar</option>
                        {rutinas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                      </select>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                      <label style={{ fontSize: '0.85rem', color: '#a1a1aa', display: 'block', marginBottom: '8px' }}>Dieta Asignada</label>
                      <select value={c.dieta_asignada_id || ''} onChange={(e) => asignarDieta(c.id, e.target.value)} disabled={guardando === c.id} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0e0e10', color: '#fff', border: '1px solid #444' }}>
                        <option value="">Sin asignar</option>
                        {dietas.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                      </select>
                    </div>

                    <button onClick={() => eliminarAlumno(c.id, (c.profiles as any)?.email)} disabled={guardando === c.id} style={{ width: '100%', marginTop: '20px', background: 'rgba(230,74,16,0.1)', border: '1px solid #e64a10', color: '#e64a10', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      🗑️ Quitar del Gym
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <style>{`
        /* Por defecto (PC), ocultamos la lista y mostramos la tabla */
        .desktop-table { display: block; }
        .mobile-list { display: none; }

        /* En celular, ocultamos la tabla y mostramos el acordeón */
        @media (max-width: 900px) {
          .desktop-table { display: none !important; }
          .mobile-list { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

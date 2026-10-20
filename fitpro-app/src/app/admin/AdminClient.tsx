'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminClient({ initialGyms, initialUsers }: { initialGyms: any[], initialUsers: any[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [gyms, setGyms] = useState(initialGyms)
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)

  const totalEntrenadores = users.filter(u => u.rol === 'entrenador').length
  const totalClientes = users.filter(u => u.rol === 'cliente').length

  async function toggleGym(id: string, currentStatus: boolean) {
    setLoading(id)
    const { error } = await supabase.from('gyms').update({ activo: !currentStatus }).eq('id', id)
    if (!error) setGyms(prev => prev.map(g => g.id === id ? { ...g, activo: !currentStatus } : g))
    else alert('Error: ' + error.message)
    setLoading(null)
  }

  async function deleteGym(id: string, nombre: string) {
    if (!confirm(`¿Estás seguro de eliminar el gimnasio "${nombre}"? Se borrarán TODOS sus datos.`)) return
    setLoading(id)
    const { error } = await supabase.from('gyms').delete().eq('id', id)
    if (!error) setGyms(prev => prev.filter(g => g.id !== id))
    else alert('Error: ' + error.message)
    setLoading(null)
  }

  async function changeRole(userId: string, newRole: string) {
    setLoading(userId)
    const { error } = await supabase.from('profiles').update({ rol: newRole }).eq('id', userId)
    if (!error) setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRole } : u))
    else alert('Error: ' + error.message)
    setLoading(null)
  }

  const cardStyle = {
    background: 'rgba(23, 23, 27, 0.7)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* TARJETAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ ...cardStyle, padding: '30px', textAlign: 'center', borderTop: '4px solid #ff5a1f' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{gyms.length}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Gimnasios</div>
        </div>
        <div style={{ ...cardStyle, padding: '30px', textAlign: 'center', borderTop: '4px solid #22c55e' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{totalEntrenadores}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Entrenadores</div>
        </div>
        <div style={{ ...cardStyle, padding: '30px', textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{totalClientes}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Alumnos</div>
        </div>
      </div>

      {/* TABLA GIMNASIOS */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '15px', fontWeight: 800 }}>🏢 Gimnasios Registrados</h2>
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Gimnasio</th>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Dueño</th>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado</th>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gyms.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#a1a1aa' }}>No hay gimnasios.</td></tr>
              ) : gyms.map((g: any) => (
                <tr key={g.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 700 }}>{g.nombre} {g.sufijo}</div>
                    <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>/{g.slug}</div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#a1a1aa' }}>{g.profiles?.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, background: g.activo ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: g.activo ? '#4ade80' : '#f87171' }}>
                      {g.activo ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleGym(g.id, g.activo)} disabled={loading === g.id} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: g.activo ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)', color: g.activo ? '#facc15' : '#4ade80', fontWeight: 700, fontSize: '0.8rem' }}>
                      {g.activo ? 'Pausar' : 'Activar'}
                    </button>
                    <button onClick={() => deleteGym(g.id, g.nombre)} disabled={loading === g.id} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, fontSize: '0.8rem' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLA USUARIOS */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '15px', fontWeight: 800 }}>👥 Control de Usuarios</h2>
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
              <tr>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Usuario</th>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rol</th>
                <th style={{ padding: '16px 24px', color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Cambiar</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#a1a1aa' }}>No hay usuarios.</td></tr>
              ) : users.map((u: any) => (
                <tr key={u.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 600 }}>{u.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, background: u.rol === 'admin' ? 'rgba(255,90,31,0.15)' : u.rol === 'entrenador' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#4ade80' : '#60a5fa' }}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <select value={u.rol} onChange={(e) => changeRole(u.id, e.target.value)} disabled={loading === u.id || u.email === 'aguirrebrandon758@gmail.com'} style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontWeight: 600 }}>
                      <option value="cliente">Cliente</option>
                      <option value="entrenador">Entrenador</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

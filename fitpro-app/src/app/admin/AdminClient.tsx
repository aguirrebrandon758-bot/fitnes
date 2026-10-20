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
    if (!error) {
      setGyms(prev => prev.map(g => g.id === id ? { ...g, activo: !currentStatus } : g))
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(null)
  }

  async function deleteGym(id: string, nombre: string) {
    if (!confirm(`¿Estás seguro de eliminar el gimnasio "${nombre}"? Se borrarán TODOS sus datos.`)) return
    setLoading(id)
    const { error } = await supabase.from('gyms').delete().eq('id', id)
    if (!error) {
      setGyms(prev => prev.filter(g => g.id !== id))
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(null)
  }

  async function changeRole(userId: string, newRole: string) {
    setLoading(userId)
    const { error } = await supabase.from('profiles').update({ rol: newRole }).eq('id', userId)
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, rol: newRole } : u))
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* TARJETAS DE RESUMEN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#17171b', padding: '24px', borderRadius: '16px', border: '1px solid #2a2a32', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff5a1f' }}>{gyms.length}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Gimnasios</div>
        </div>
        <div style={{ background: '#17171b', padding: '24px', borderRadius: '16px', border: '1px solid #2a2a32', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e' }}>{totalEntrenadores}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entrenadores</div>
        </div>
        <div style={{ background: '#17171b', padding: '24px', borderRadius: '16px', border: '1px solid #2a2a32', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6' }}>{totalClientes}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Alumnos</div>
        </div>
      </div>

      {/* TABLA DE GIMNASIOS */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🏢 Gimnasios Registrados
        </h2>
        <div style={{ background: '#17171b', borderRadius: '16px', border: '1px solid #2a2a32', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px' }}>Gimnasio</th>
                <th style={{ padding: '16px 24px' }}>Dueño</th>
                <th style={{ padding: '16px 24px' }}>Estado</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gyms.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#a1a1aa' }}>No hay gimnasios registrados.</td></tr>
              ) : gyms.map((g: any) => (
                <tr key={g.id} style={{ borderBottom: '1px solid #2a2a32', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{g.nombre} {g.sufijo}</div>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>/{g.slug}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>{g.profiles?.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', background: g.activo ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: g.activo ? '#4ade80' : '#f87171', border: `1px solid ${g.activo ? '#22c55e' : '#ef4444'}` }}>
                      {g.activo ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleGym(g.id, g.activo)} disabled={loading === g.id} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: g.activo ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.2)', color: g.activo ? '#facc15' : '#4ade80', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {g.activo ? 'Pausar' : 'Activar'}
                    </button>
                    <button onClick={() => deleteGym(g.id, g.nombre)} disabled={loading === g.id} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          👥 Control de Usuarios
        </h2>
        <div style={{ background: '#17171b', borderRadius: '16px', border: '1px solid #2a2a32', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(0,0,0,0.2)', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px' }}>Usuario (Email)</th>
                <th style={{ padding: '16px 24px' }}>Rol Actual</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Cambiar Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: '#a1a1aa' }}>No hay usuarios registrados.</td></tr>
              ) : users.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #2a2a32', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>{u.email}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', background: u.rol === 'admin' ? 'rgba(255,90,31,0.15)' : u.rol === 'entrenador' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#4ade80' : '#60a5fa', border: `1px solid ${u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#22c55e' : '#3b82f6'}` }}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <select 
                      value={u.rol} 
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={loading === u.id || u.email === 'aguirrebrandon758@gmail.com'}
                      style={{ padding: '8px 12px', borderRadius: '8px', background: '#0e0e10', color: '#fff', border: '1px solid #2a2a32', cursor: 'pointer', outline: 'none' }}
                    >
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

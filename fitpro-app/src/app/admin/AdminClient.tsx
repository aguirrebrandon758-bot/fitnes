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
    if (!confirm(`¿Estás seguro de eliminar el gimnasio "${nombre}"? Se borrarán TODOS sus datos (ejercicios, rutinas, alumnos).`)) return
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      
      {/* TABLA DE GIMNASIOS */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#ff5a1f' }}>🏢 Gimnasios Registrados</h2>
        <div style={{ background: '#17171b', borderRadius: '12px', border: '1px solid #2a2a32', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead style={{ background: '#0e0e10', color: '#a1a1aa', fontSize: '0.85rem' }}>
              <tr>
                <th style={{ padding: '16px' }}>Gym</th>
                <th style={{ padding: '16px' }}>Dueño</th>
                <th style={{ padding: '16px' }}>Estado</th>
                <th style={{ padding: '16px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gyms.map((g: any) => (
                <tr key={g.id} style={{ borderBottom: '1px solid #2a2a32' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{g.nombre} <br/><span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>/{g.slug}</span></td>
                  <td style={{ padding: '16px' }}>{g.profiles?.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', background: g.activo ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: g.activo ? '#4ade80' : '#f87171' }}>
                      {g.activo ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => toggleGym(g.id, g.activo)} disabled={loading === g.id} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: g.activo ? '#eab308' : '#22c55e', color: '#fff', fontSize: '0.8rem' }}>
                      {g.activo ? 'Pausar' : 'Activar'}
                    </button>
                    <button onClick={() => deleteGym(g.id, g.nombre)} disabled={loading === g.id} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#ef4444', color: '#fff', fontSize: '0.8rem' }}>
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#ff5a1f' }}>👥 Todos los Usuarios</h2>
        <div style={{ background: '#17171b', borderRadius: '12px', border: '1px solid #2a2a32', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead style={{ background: '#0e0e10', color: '#a1a1aa', fontSize: '0.85rem' }}>
              <tr>
                <th style={{ padding: '16px' }}>Email</th>
                <th style={{ padding: '16px' }}>Rol Actual</th>
                <th style={{ padding: '16px' }}>Cambiar Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #2a2a32' }}>
                  <td style={{ padding: '16px' }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', background: u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#22c55e' : '#3b82f6', color: '#fff' }}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select 
                      value={u.rol} 
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={loading === u.id || u.email === 'aguirrebrandon758@gmail.com'} // No te podés cambiar el rol a vos mismo
                      style={{ padding: '8px', borderRadius: '6px', background: '#0e0e10', color: '#fff', border: '1px solid #2a2a32' }}
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

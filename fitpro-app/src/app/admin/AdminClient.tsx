'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminClient({ initialGyms, initialUsers }: { initialGyms: any[], initialUsers: any[] }) {
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
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  }

  const thStyle = {
    padding: '20px 24px',
    color: '#a1a1aa',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 700
  }

  const tdStyle = {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* TARJETAS DE RESUMEN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={{ ...cardStyle, padding: '30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ff5a1f' }}></div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{gyms.length}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Gimnasios</div>
        </div>
        <div style={{ ...cardStyle, padding: '30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#22c55e' }}></div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{totalEntrenadores}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Entrenadores</div>
        </div>
        <div style={{ ...cardStyle, padding: '30px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#3b82f6' }}></div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{totalClientes}</div>
          <div style={{ color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Alumnos</div>
        </div>
      </div>

      {/* TABLA DE GIMNASIOS */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 800 }}>🏢 Gimnasios Registrados</h2>
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={thStyle}>Gimnasio</th>
                <th style={thStyle}>Dueño</th>
                <th style={thStyle}>Estado</th>
                <th style={{...thStyle, textAlign: 'right'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {gyms.length === 0 ? (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#a1a1aa', padding: '40px' }}>No hay gimnasios registrados aún.</td></tr>
              ) : gyms.map((g: any) => (
                <tr key={g.id} style={{ transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{g.nombre} {g.sufijo}</div>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>/{g.slug}</div>
                  </td>
                  <td style={{ ...tdStyle, color: '#a1a1aa' }}>{g.profiles?.email}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, background: g.activo ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: g.activo ? '#4ade80' : '#f87171', border: `1px solid ${g.activo ? '#22c55e' : '#ef4444'}` }}>
                      {g.activo ? 'ACTIVO' : 'PAUSADO'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleGym(g.id, g.activo)} disabled={loading === g.id} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: g.activo ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)', color: g.activo ? '#facc15' : '#4ade80', fontWeight: 700, transition: 'all 0.2s' }}>
                      {g.activo ? 'Pausar' : 'Activar'}
                    </button>
                    <button onClick={() => deleteGym(g.id, g.nombre)} disabled={loading === g.id} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, transition: 'all 0.2s' }}>
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 800 }}>👥 Control de Usuarios</h2>
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={thStyle}>Usuario (Email)</th>
                <th style={thStyle}>Rol Actual</th>
                <th style={{...thStyle, textAlign: 'right'}}>Cambiar Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#a1a1aa', padding: '40px' }}>No hay usuarios registrados aún.</td></tr>
              ) : users.map((u: any) => (
                <tr key={u.id} style={{ transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{u.email}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, background: u.rol === 'admin' ? 'rgba(255,90,31,0.15)' : u.rol === 'entrenador' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#4ade80' : '#60a5fa', border: `1px solid ${u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#22c55e' : '#3b82f6'}` }}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, display: 'flex', justifyContent: 'flex-end' }}>
                    <select 
                      value={u.rol} 
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      disabled={loading === u.id || u.email === 'aguirrebrandon758@gmail.com'}
                      style={{ padding: '10px 16px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', outline: 'none', fontWeight: 600 }}
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

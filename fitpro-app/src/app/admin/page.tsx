import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verificar que sea admin
  const { data: perfil } = await supabase.from('profiles').select('rol').eq('id', user.id).single()
  if (perfil?.rol !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e10', color: '#fff' }}>
        <h1>Acceso Denegado. Solo el dueño de FitPro puede ver esto.</h1>
      </div>
    )
  }

  // Traer TODOS los gimnasios y sus dueños
  const { data: gyms } = await supabase.from('gyms').select('*, profiles(email)').order('creado_en', { ascending: false })
  
  // Traer TODOS los usuarios
  const { data: usuarios } = await supabase.from('profiles').select('*').order('creado_en', { ascending: false })

  // Traer TODOS los clientes vinculados
  const { data: vinculaciones } = await supabase.from('gym_clientes').select('*, profiles(email), gyms(nombre)')

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', color: '#fff', padding: '40px 20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #2a2a32', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ff5a1f' }}>👑 Panel de Superadministrador</h1>
            <p style={{ color: '#a1a1aa' }}>Vista global de FitPro</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/panel" style={{ color: '#fff', textDecoration: 'none', padding: '10px 20px', border: '1px solid #2a2a32', borderRadius: '8px' }}>Ir a mi panel</Link>
            <form action="/auth/signout" method="post">
              <button type="submit" style={{ background: 'transparent', color: '#ff5a1f', border: '1px solid #ff5a1f', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cerrar sesión</button>
            </form>
          </div>
        </header>

        {/* Estadísticas Globales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: '#17171b', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a32', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff5a1f' }}>{gyms?.length || 0}</div>
            <div style={{ color: '#a1a1aa' }}>Gimnasios</div>
          </div>
          <div style={{ background: '#17171b', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a32', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffb703' }}>{usuarios?.length || 0}</div>
            <div style={{ color: '#a1a1aa' }}>Usuarios Totales</div>
          </div>
          <div style={{ background: '#17171b', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a32', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e' }}>{usuarios?.filter(u => u.rol === 'entrenador').length || 0}</div>
            <div style={{ color: '#a1a1aa' }}>Entrenadores</div>
          </div>
          <div style={{ background: '#17171b', padding: '20px', borderRadius: '12px', border: '1px solid #2a2a32', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6' }}>{usuarios?.filter(u => u.rol === 'cliente').length || 0}</div>
            <div style={{ color: '#a1a1aa' }}>Alumnos</div>
          </div>
        </div>

        {/* Tabla de Gimnasios */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Gimnasios Registrados</h2>
        <div style={{ background: '#17171b', borderRadius: '12px', border: '1px solid #2a2a32', overflow: 'hidden', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#0e0e10', color: '#a1a1aa', fontSize: '0.85rem' }}>
              <tr>
                <th style={{ padding: '16px' }}>Gym</th>
                <th style={{ padding: '16px' }}>Dueño</th>
                <th style={{ padding: '16px' }}>Código Invitación</th>
                <th style={{ padding: '16px' }}>URL Pública</th>
              </tr>
            </thead>
            <tbody>
              {gyms?.map((g: any) => (
                <tr key={g.id} style={{ borderBottom: '1px solid #2a2a32' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold' }}>{g.nombre} {g.sufijo}</td>
                  <td style={{ padding: '16px' }}>{g.profiles?.email}</td>
                  <td style={{ padding: '16px', color: '#ff5a1f', fontWeight: 'bold' }}>{g.codigo_invitacion}</td>
                  <td style={{ padding: '16px' }}><a href={`/${g.slug}`} target="_blank" style={{ color: '#3b82f6' }}>/{g.slug}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla de Usuarios */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Todos los Usuarios</h2>
        <div style={{ background: '#17171b', borderRadius: '12px', border: '1px solid #2a2a32', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#0e0e10', color: '#a1a1aa', fontSize: '0.85rem' }}>
              <tr>
                <th style={{ padding: '16px' }}>Email</th>
                <th style={{ padding: '16px' }}>Rol</th>
                <th style={{ padding: '16px' }}>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios?.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #2a2a32' }}>
                  <td style={{ padding: '16px' }}>{u.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold',
                      background: u.rol === 'admin' ? '#ff5a1f' : u.rol === 'entrenador' ? '#22c55e' : '#3b82f6',
                      color: u.rol === 'cliente' ? '#fff' : '#fff'
                    }}>
                      {u.rol.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#a1a1aa' }}>{new Date(u.creado_en).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

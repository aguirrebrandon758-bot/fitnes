import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase.from('profiles').select('rol').eq('id', user.id).maybeSingle()
  if (user.email !== 'aguirrebrandon758@gmail.com' && perfil?.rol !== 'admin') {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#fff', background: '#0e0e10', minHeight: '100vh' }}><h1>Acceso Denegado.</h1></div>
  }

  // 👇 LLAMAMOS A LA FUNCIÓN MÁGICA QUE CREAMOS EN SUPABASE 👇
  const { data: adminData, error } = await supabase.rpc('get_admin_data')
  
  if (error) {
    console.error(error)
    return <div style={{ padding: '50px', color: '#ff5a1f', background: '#0e0e10', minHeight: '100vh' }}>Error cargando datos: {error.message}</div>
  }

  const gyms = adminData?.gyms || []
  const usuarios = adminData?.users || []

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, rgba(255, 90, 31, 0.15) 0%, #0e0e10 40%)', 
      color: '#fff', 
      fontFamily: 'system-ui'
    }}>
      
      {/* HEADER STICKY (No se corta nada) */}
      <header style={{ 
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(14, 14, 16, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
            👑 <span style={{ color: '#ff5a1f' }}>FitPro</span> Control
          </h1>
          <p style={{ color: '#a1a1aa', margin: '5px 0 0 0', fontSize: '0.9rem' }}>Vista global de la plataforma</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/panel" style={{ color: '#fff', textDecoration: 'none', padding: '10px 20px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', fontWeight: 600 }}>
            🏋️ Ir a mi Gym
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" style={{ background: 'rgba(255, 90, 31, 0.1)', color: '#ff5a1f', border: '1px solid #ff5a1f', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      {/* CONTENIDO CON PADDING PARA NO CORTARSE */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
        <AdminClient initialGyms={gyms} initialUsers={usuarios} />
      </div>

    </div>
  )
}

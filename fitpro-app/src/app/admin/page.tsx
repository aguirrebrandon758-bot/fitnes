import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isSuperAdmin = user.email === 'aguirrebrandon758@gmail.com'
  const { data: perfil } = await supabase.from('profiles').select('rol').eq('id', user.id).maybeSingle()
  
  if (!isSuperAdmin && perfil?.rol !== 'admin') {
    return <div style={{ padding: '50px', textAlign: 'center', color: '#fff', background: '#0e0e10', minHeight: '100vh' }}><h1>Acceso Denegado.</h1></div>
  }

  const { data: gyms, error: gymError } = await supabase.from('gyms').select('*, profiles(email)').order('creado_en', { ascending: false })
  const { data: usuarios, error: userError } = await supabase.from('profiles').select('*').order('creado_en', { ascending: false })

  if (gymError) console.error("Error cargando gyms:", gymError)
  if (userError) console.error("Error cargando usuarios:", userError)

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, rgba(255, 90, 31, 0.15) 0%, #0e0e10 40%)', 
      color: '#fff', 
      fontFamily: 'system-ui',
      paddingTop: '60px', // Espacio para que no se corte arriba
      paddingBottom: '60px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* HEADER */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '50px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          paddingBottom: '20px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>
              👑 <span style={{ color: '#ff5a1f' }}>FitPro</span> Control
            </h1>
            <p style={{ color: '#a1a1aa', margin: '5px 0 0 0', fontSize: '1.1rem' }}>Vista global de la plataforma</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/panel" style={{ 
              color: '#fff', 
              textDecoration: 'none', 
              padding: '12px 24px', 
              border: '1px solid rgba(255,255,255,0.2)', 
              borderRadius: '12px', 
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}>
              🏋️ Ir a mi Gym
            </Link>
            
            <form action="/auth/signout" method="post">
              <button type="submit" style={{ 
                background: 'rgba(255, 90, 31, 0.1)', 
                color: '#ff5a1f', 
                border: '1px solid #ff5a1f', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}>
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>

        <AdminClient initialGyms={gyms || []} initialUsers={usuarios || []} />

      </div>
    </div>
  )
}

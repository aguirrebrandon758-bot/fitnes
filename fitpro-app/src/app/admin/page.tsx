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

  const { data: gyms } = await supabase.from('gyms').select('*, profiles(email)').order('creado_en', { ascending: false })
  const { data: usuarios } = await supabase.from('profiles').select('*').order('creado_en', { ascending: false })

  return (
    // 👇 ACÁ ESTÁ EL ARREGLO DEL SCROLL 👇
    <div style={{ height: '100vh', overflowY: 'auto', background: '#0e0e10', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #2a2a32', paddingBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ff5a1f' }}>👑 Panel de Superadministrador</h1>
            <p style={{ color: '#a1a1aa' }}>Control total de FitPro</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/panel" style={{ color: '#fff', textDecoration: 'none', padding: '10px 20px', border: '1px solid #2a2a32', borderRadius: '8px', background: '#17171b' }}>Ir a mi panel</Link>
            <form action="/auth/signout" method="post">
              <button type="submit" style={{ background: 'transparent', color: '#ff5a1f', border: '1px solid #ff5a1f', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cerrar sesión</button>
            </form>
          </div>
        </header>

        <AdminClient initialGyms={gyms || []} initialUsers={usuarios || []} />

      </div>
    </div>
  )
}

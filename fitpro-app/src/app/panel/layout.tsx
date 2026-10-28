import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PanelLayoutClient from './PanelLayoutClient'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const isSuperAdmin = user.email?.toLowerCase().trim() === 'aguirrebrandon758@gmail.com'
  
  let checkGym = null;
  if (isSuperAdmin) {
    const { data } = await supabase.from('gyms').select('*').eq('slug', 'gym-demo').maybeSingle()
    checkGym = data || { id: '0', nombre: 'Mi Gym', slug: 'gym-demo', color_primario: '#ff5a1f', color_secundario: '#ffb703' }
  } else {
    const { data } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle()
    checkGym = data
  }

  if (!checkGym) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>
        {children}
        <PanelLayoutClient isSuperAdmin={false} gymSlug="" userEmail={user.email} />
      </div>
    )
  }

  const dynamicStyles = {
    '--accent': checkGym.color_primario || '#ff5a1f',
    '--accent-2': checkGym.color_secundario || '#ffb703',
  } as React.CSSProperties

  return (
    <div style={dynamicStyles}>
      <PanelLayoutClient 
        isSuperAdmin={isSuperAdmin} 
        gymSlug={checkGym.slug} 
        userEmail={user.email}
      >
        {children}
      </PanelLayoutClient>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

        .page-container { padding: 50px; max-width: 1200px; margin: 0 auto; }
        
        @media (max-width: 900px) {
          .panel-wrapper { flex-direction: column !important; height: 100vh !important; overflow: hidden !important; }
          .main-content { padding: 20px 15px 180px 15px !important; }
          .page-container { padding: 20px 0; }
        }
      `}</style>
    </div>
  )
}

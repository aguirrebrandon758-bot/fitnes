import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MusicPlayer from '@/components/MusicPlayer'

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
        <MusicPlayer />
      </div>
    )
  }

  const dynamicStyles = {
    '--accent': checkGym.color_primario || '#ff5a1f',
    '--accent-2': checkGym.color_secundario || '#ffb703',
  } as React.CSSProperties

  return (
    <div className="panel-wrapper" style={{ ...dynamicStyles, display: 'flex', height: '100vh', width: '100vw', background: '#09090b', color: '#fff', fontFamily: 'system-ui', overflow: 'hidden' }}>
      
      <aside className="sidebar-panel" style={{ 
        width: '280px', background: 'rgba(20, 20, 24, 0.7)', backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', 
        padding: '25px 20px', overflowY: 'auto', zIndex: 100, flexShrink: 0
      }}>
        
        <div className="sidebar-logo" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '25px', paddingLeft: '5px' }}>
          FIT<span style={{ color: 'var(--accent)' }}>PRO</span>
        </div>

        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email?.split('@')[0]}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#71717a' }}>Entrenador</div>
          </div>
        </div>

        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 15px', marginBottom: '25px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="BUSCAR..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.75rem', letterSpacing: '1px' }} />
        </div>

        <div className="sidebar-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
          {isSuperAdmin && (
            <Link href="/admin" className="sidebar-link-admin">👑 Panel Admin</Link>
          )}
          <Link href={`/${checkGym.slug}`} className="sidebar-btn-public">🌐 Mi Página Pública</Link>
        </div>

        <nav className="nav-container" style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
          
          <span className="nav-label" style={{ fontSize: '0.65rem', color: '#52525b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', paddingLeft: '10px' }}>Menú</span>
          
          <Link href="/panel" className="sidebar-link active">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Resumen
          </Link>
          <Link href="/panel/clientes" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Clientes
          </Link>
          <Link href="/panel/mi-gym" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
            Mi Gym
          </Link>
          <Link href="/panel/dietas" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
            Dietas
          </Link>
          <Link href="/panel/galeria" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            Galería
          </Link>
          <Link href="/panel/testimonios" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
            Opiniones
          </Link>

          <span className="nav-label" style={{ fontSize: '0.65rem', color: '#52525b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '20px', marginBottom: '10px', paddingLeft: '10px' }}>Contenido</span>

          <Link href="/panel/ejercicios" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12"></path><path d="M6 12h12"></path><path d="M6 16h12"></path><path d="M3 4v16"></path><path d="M21 4v16"></path></svg>
            Ejercicios
          </Link>
          <Link href="/panel/rutinas" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Rutinas
          </Link>
          <Link href="/panel/videos" className="sidebar-link">
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            Videos
          </Link>

          {/* LINK SOLO PARA CELULAR (AHORA DICE "SALIR") */}
          <div className="mobile-only-link">
             <form action="/auth/signout" method="post">
              <button type="submit" className="sidebar-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Salir
              </button>
            </form>
          </div>
        </nav>

        <div className="desktop-only" style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <form action="/auth/signout" method="post" style={{ width: '100%' }}>
            <button type="submit" className="sidebar-btn-logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="main-content custom-scrollbar" style={{ flex: 1, overflowY: 'auto', background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)' }}>
        {children}
      </main>

      <MusicPlayer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        
        .sidebar-link {
          display: flex; align-items: center; gap: 12px; padding: 10px 15px;
          border-radius: 12px; color: #a1a1aa; text-decoration: none;
          font-weight: 500; font-size: 0.9rem; transition: all 0.2s ease;
        }
        .sidebar-link:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
        .sidebar-link.active { background: var(--accent); color: #fff; font-weight: 600; }
        
        .sidebar-link-admin {
          display: flex; align-items: center; justify-content: center; padding: 10px;
          border-radius: 12px; background: rgba(255, 90, 31, 0.1); color: var(--accent);
          border: 1px solid var(--accent); text-decoration: none; font-weight: 700;
          font-size: 0.85rem; transition: all 0.2s;
        }
        .sidebar-link-admin:hover { background: var(--accent); color: #fff; }
        
        .sidebar-btn-public {
          display: flex; align-items: center; justify-content: center; padding: 10px;
          border-radius: 12px; background: var(--accent); color: #fff; text-decoration: none;
          font-weight: 700; font-size: 0.85rem; transition: transform 0.2s;
        }
        .sidebar-btn-public:hover { transform: scale(1.02); box-shadow: 0 0 15px var(--accent); }
        
        .sidebar-btn-logout {
          width: 100%; background: transparent; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1);
          padding: 10px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.85rem;
        }
        .sidebar-btn-logout:hover { background: rgba(255,255,255,0.05); color: #fff; }

        .page-container { padding: 50px; max-width: 1200px; margin: 0 auto; }
        .mobile-only-link { display: none !important; }

        @media (max-width: 900px) {
          .panel-wrapper { flex-direction: column !important; height: 100vh !important; overflow: hidden !important; }
          
          .sidebar-panel {
            width: 92% !important; max-width: 450px !important; height: 68px !important;
            position: fixed !important; bottom: 20px !important; left: 50% !important; transform: translateX(-50%) !important;
            border-radius: 50px !important; background: rgba(20, 20, 24, 0.95) !important; backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255,255,255,0.1) !important; padding: 0 10px !important; flex-direction: row !important;
            overflow: visible !important; box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important; z-index: 9999 !important;
          }
          
          .sidebar-logo, .user-profile, .search-bar, .sidebar-actions, .desktop-only, .nav-label { display: none !important; }
          
          .nav-container {
            flex-direction: row !important; width: 100% !important; justify-content: flex-start !important;
            align-items: center !important; overflow-x: auto !important; overflow-y: hidden !important;
            gap: 5px !important; padding: 0 !important; height: 100% !important; -webkit-overflow-scrolling: touch;
          }
          .nav-container::-webkit-scrollbar { display: none; }
          
          .sidebar-link, .sidebar-link-admin {
            flex-direction: column !important; padding: 8px 15px !important; font-size: 0.65rem !important;
            gap: 4px !important; white-space: nowrap !important; min-width: 65px; text-align: center; border-radius: 12px !important;
          }
          
          .mobile-only-link { 
            display: flex !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            border: none !important; 
          }
          
          .main-content { padding: 20px 15px 180px 15px !important; }
          .page-container { padding: 20px 0; }
        }
      `}</style>
    </div>
  )
}

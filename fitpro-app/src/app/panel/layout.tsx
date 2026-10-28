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
    <div className="panel-wrapper" style={{ ...dynamicStyles, display: 'flex', height: '100vh', width: '100vw', background: '#050505', color: '#fff', fontFamily: 'system-ui', overflow: 'hidden' }}>
      
      {/* SIDEBAR (Escritorio) / BOTTOM NAV (Celular) */}
      <aside className="sidebar-panel" style={{ 
        width: '280px', 
        background: '#0a0a0c', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', 
        padding: '30px 20px 20px 20px',
        overflowY: 'auto',
        zIndex: 100,
        flexShrink: 0
      }}>
        {/* Logo (Oculto en celular) */}
        <div className="sidebar-logo" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '30px', paddingLeft: '10px' }}>
          FIT<span style={{ color: 'var(--accent)' }}>PRO</span>
        </div>

        {/* Botones de Acción (Ocultos en celular, se mueven al menú inferior) */}
        <div className="sidebar-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '30px' }}>
          {isSuperAdmin && (
            <Link href="/admin" className="sidebar-link-admin">👑 Panel Admin</Link>
          )}
          <Link href={`/${checkGym.slug}`} className="sidebar-btn-public">🌐 Mi Página Pública</Link>
          <form action="/auth/signout" method="post" style={{ width: '100%' }}>
            <button type="submit" className="sidebar-btn-logout">Cerrar sesión</button>
          </form>
        </div>

        <div className="sidebar-divider" style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '20px' }}></div>

        {/* Links de Navegación (Se convierten en la barra inferior en celular) */}
        <nav className="nav-container" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <Link href="/panel" className="sidebar-link"><span>📊</span> Resumen</Link>
          <Link href="/panel/clientes" className="sidebar-link"><span>👥</span> Clientes</Link>
          <Link href="/panel/mi-gym" className="sidebar-link"><span>🏢</span> Mi Gym</Link>
          <Link href="/panel/dietas" className="sidebar-link"><span>🍏</span> Dietas</Link>
          <Link href="/panel/galeria" className="sidebar-link"><span>📸</span> Galería</Link>
          <Link href="/panel/testimonios" className="sidebar-link"><span>💬</span> Opiniones</Link>
          <Link href="/panel/ejercicios" className="sidebar-link"><span>📋</span> Ejercicios</Link>
          <Link href="/panel/rutinas" className="sidebar-link"><span>🏋️</span> Rutinas</Link>
          <Link href="/panel/videos" className="sidebar-link"><span>🎥</span> Videos</Link>
          
          {/* En celular, estos botones extra se suman a la barra deslizable */}
          {isSuperAdmin && (
            <Link href="/admin" className="sidebar-link mobile-only-link"><span>👑</span> Admin</Link>
          )}
          <Link href={`/${checkGym.slug}`} className="sidebar-link mobile-only-link"><span>🌐</span> Mi Web</Link>
          <form action="/auth/signout" method="post" className="mobile-only-link" style={{ display: 'flex', width: '100%' }}>
            <button type="submit" className="sidebar-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}><span>🚪</span> Salir</button>
          </form>
        </nav>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="main-content custom-scrollbar" style={{ 
        flex: 1, 
        overflowY: 'auto',
        background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)'
      }}>
        {children}
      </main>

      <MusicPlayer />

      {/* ESTILOS CSS */}
      <style>{`
        /* --- ESTILOS GLOBALES (ESCRITORIO) --- */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        
        .sidebar-link {
          display: flex; align-items: center; gap: 12px; padding: 12px 15px;
          border-radius: 12px; color: #a1a1aa; text-decoration: none;
          font-weight: 600; font-size: 0.95rem; transition: all 0.2s ease;
        }
        .sidebar-link span { font-size: 1.2rem; }
        .sidebar-link:hover { background: rgba(255, 255, 255, 0.05); color: #fff; transform: translateX(4px); }
        
        .sidebar-link-admin {
          display: flex; align-items: center; justify-content: center; padding: 12px;
          border-radius: 12px; background: rgba(255, 90, 31, 0.1); color: var(--accent);
          border: 1px solid var(--accent); text-decoration: none; font-weight: 700;
          font-size: 0.9rem; transition: all 0.2s;
        }
        .sidebar-link-admin:hover { background: var(--accent); color: #fff; }
        
        .sidebar-btn-public {
          display: flex; align-items: center; justify-content: center; padding: 12px;
          border-radius: 12px; background: var(--accent); color: #fff; text-decoration: none;
          font-weight: 700; font-size: 0.9rem; transition: transform 0.2s;
        }
        .sidebar-btn-public:hover { transform: scale(1.02); }
        
        .sidebar-btn-logout {
          width: 100%; background: transparent; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1);
          padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .sidebar-btn-logout:hover { background: rgba(255,255,255,0.05); color: #fff; }

        .page-container { padding: 60px; max-width: 1200px; margin: 0 auto; }
        .mobile-only-link { display: none !important; } /* Oculto en PC */

        /* --- ESTILOS EXCLUSIVOS PARA CELULARES --- */
        @media (max-width: 900px) {
          .panel-wrapper {
            flex-direction: column !important;
            height: 100vh !important;
            overflow: hidden !important;
          }

          /* Transformar Sidebar en Bottom Navigation Bar */
          .sidebar-panel {
            width: 95% !important;
            max-width: 500px !important;
            height: 70px !important;
            position: fixed !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            border-radius: 50px !important;
            background: rgba(20, 20, 24, 0.85) !important;
            backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            padding: 0 10px !important;
            flex-direction: row !important;
            overflow: visible !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
            z-index: 9999 !important;
          }

          /* Ocultar Logo, botones de acción y divisor en celular */
          .sidebar-logo, .sidebar-actions, .sidebar-divider { display: none !important; }

          /* El contenedor de links se vuelve horizontal */
          .nav-container {
            flex-direction: row !important;
            width: 100% !important;
            justify-content: flex-start !important;
            align-items: center !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            gap: 5px !important;
            padding: 0 !important;
            height: 100% !important;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Ocultar la barra de scroll en celular */
          .nav-container::-webkit-scrollbar { display: none; }

          /* Estilo de los botones en el menú inferior */
          .sidebar-link, .sidebar-link-admin {
            flex-direction: column !important;
            padding: 8px 15px !important;
            font-size: 0.65rem !important;
            gap: 4px !important;
            white-space: nowrap !important;
            min-width: 65px;
            text-align: center;
            border-radius: 12px !important;
          }
          
          .sidebar-link span { font-size: 1.3rem !important; margin-bottom: 2px; }
          
          /* Mostrar los links extra en el celular */
          .mobile-only-link { display: flex !important; }

          /* Ajustar el contenido principal para que la barra no lo tape */
          .main-content {
            padding: 20px 15px 110px 15px !important;
          }
          
          .page-container { padding: 20px 0; }
        }
      `}</style>
    </div>
  )
}

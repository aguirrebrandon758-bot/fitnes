import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MusicPlayer from '@/components/MusicPlayer'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const isSuperAdmin = user.email?.toLowerCase().trim() === 'aguirrebrandon758@gmail.com'
  
  // Buscamos el gym para tomar los colores
  let checkGym = null;
  if (isSuperAdmin) {
    const { data } = await supabase.from('gyms').select('*').eq('slug', 'gym-demo').maybeSingle()
    checkGym = data || { id: '0', nombre: 'Mi Gym', slug: 'gym-demo', color_primario: '#ff5a1f', color_secundario: '#ffb703' }
  } else {
    const { data } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle()
    checkGym = data
  }

  // Si no tiene gym (ej: recién se registra), no le mostramos el sidebar, solo el children
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
    <div style={{ ...dynamicStyles, display: 'flex', height: '100vh', width: '100vw', background: '#050505', color: '#fff', fontFamily: 'system-ui', overflow: 'hidden' }}>
      
      {/* ================= SIDEBAR PERSISTENTE ================= */}
      <aside className="custom-scrollbar" style={{ 
        width: '280px', 
        background: '#0a0a0c', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', 
        padding: '30px 20px 20px 20px',
        overflowY: 'auto', zIndex: 10,
        flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '30px', paddingLeft: '10px' }}>
          FIT<span style={{ color: 'var(--accent)' }}>PRO</span>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '30px' }}>
          {isSuperAdmin && (
            <Link href="/admin" className="sidebar-link-admin">👑 Panel Admin</Link>
          )}
          <Link href={`/${checkGym.slug}`} className="sidebar-btn-public">🌐 Mi Página Pública</Link>
          <form action="/auth/signout" method="post" style={{ width: '100%' }}>
            <button type="submit" className="sidebar-btn-logout">Cerrar sesión</button>
          </form>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '20px' }}></div>

        {/* Navegación */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '10px' }}>Gestión</span>
          
          <Link href="/panel" className="sidebar-link"><span>📊</span> Resumen</Link>
          <Link href="/panel/clientes" className="sidebar-link"><span>👥</span> Clientes</Link>
          <Link href="/panel/mi-gym" className="sidebar-link"><span>🏢</span> Mi Gym</Link>
          <Link href="/panel/dietas" className="sidebar-link"><span>🍏</span> Dietas</Link>
          <Link href="/panel/galeria" className="sidebar-link"><span>📸</span> Galería</Link>
          <Link href="/panel/testimonios" className="sidebar-link"><span>💬</span> Testimonios</Link>

          <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '25px', marginBottom: '10px', paddingLeft: '10px' }}>Contenido</span>
          
          <Link href="/panel/ejercicios" className="sidebar-link"><span>📋</span> Ejercicios</Link>
          <Link href="/panel/rutinas" className="sidebar-link"><span>🏋️</span> Rutinas</Link>
          <Link href="/panel/videos" className="sidebar-link"><span>🎥</span> Videos</Link>
        </nav>
      </aside>

      {/* ================= ÁREA DE CONTENIDO DINÁMICO ================= */}
      <main className="custom-scrollbar" style={{ 
        flex: 1, 
        overflowY: 'auto',
        background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)'
      }}>
        {children}
      </main>

      <MusicPlayer />

      {/* ESTILOS GLOBALES DEL PANEL */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }

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

        /* Estilos para que todas las páginas internas se vean bien sin romper el layout */
        .page-container {
          padding: 60px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .page-container { padding: 30px 20px; }
        }
      `}</style>
    </div>
  )
}

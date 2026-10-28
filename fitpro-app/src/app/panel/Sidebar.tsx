'use client'

import Link from 'next/link'

export default function Sidebar({ isExpanded, setIsExpanded, isSuperAdmin, gymSlug, userEmail }: any) {
  return (
    <aside className={`sidebar-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      
      {/* LA FLECHA */}
      <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? 'Cerrar menú' : 'Abrir menú'}>
        {isExpanded ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        )}
      </button>

      <div className="sidebar-header">
        <div className="logo" style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '25px' }}>
          FIT<span style={{ color: 'var(--accent)' }}>PRO</span>
        </div>
        <div className="user-profile">
          <div className="avatar">{userEmail?.charAt(0).toUpperCase()}</div>
          <div className="info">
            <div className="name">{userEmail?.split('@')[0]}</div>
            <div className="role">Entrenador</div>
          </div>
        </div>
      </div>

      <div className="sidebar-actions">
        {isSuperAdmin && (
          <Link href="/admin" className="sidebar-link-admin">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M5 20h14"></path></svg>
            <span className="link-text">Admin</span>
          </Link>
        )}
        <Link href={`/${gymSlug}`} className="sidebar-btn-public">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span className="link-text">Mi Página</span>
        </Link>
      </div>

      <nav className="nav-container">
        <span className="nav-label">Menú</span>
        
        <Link href="/panel" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="link-text">Resumen</span>
        </Link>
        <Link href="/panel/clientes" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span className="link-text">Clientes</span>
        </Link>
        <Link href="/panel/mi-gym" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg>
          <span className="link-text">Mi Gym</span>
        </Link>
        <Link href="/panel/dietas" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
          <span className="link-text">Dietas</span>
        </Link>
        <Link href="/panel/galeria" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <span className="link-text">Galería</span>
        </Link>
        <Link href="/panel/testimonios" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path></svg>
          <span className="link-text">Opiniones</span>
        </Link>

        <span className="nav-label">Contenido</span>

        <Link href="/panel/ejercicios" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12"></path><path d="M6 12h12"></path><path d="M6 16h12"></path><path d="M3 4v16"></path><path d="M21 4v16"></path></svg>
          <span className="link-text">Ejercicios</span>
        </Link>
        <Link href="/panel/rutinas" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span className="link-text">Rutinas</span>
        </Link>
        <Link href="/panel/videos" className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
          <span className="link-text">Videos</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <form action="/auth/signout" method="post" style={{ width: '100%' }}>
          <button type="submit" className="sidebar-btn-logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span className="link-text">Salir</span>
          </button>
        </form>
      </div>

      <style>{`
        .sidebar-panel {
          width: 80px; 
          background: rgba(20, 20, 24, 0.7); backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column;
          padding: 20px 10px; overflow-y: auto; overflow-x: hidden; height: 100vh;
          z-index: 100; flex-shrink: 0; transition: width 0.3s ease;
        }
        .sidebar-panel.expanded { width: 280px; padding: 25px 20px; }

        .link-text { display: none; white-space: nowrap; margin-left: 12px; font-weight: 500; font-size: 0.9rem; }
        .sidebar-panel.expanded .link-text { display: inline-block; }

        .sidebar-header { display: none; }
        .sidebar-panel.expanded .sidebar-header { display: block; }

        .nav-label { display: none; }
        .sidebar-panel.expanded .nav-label { 
          display: block; font-size: 0.65rem; color: #52525b; font-weight: 800; 
          text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 10px 10px; 
        }

        .toggle-btn {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; border-radius: 8px; width: 100%; padding: 10px;
          cursor: pointer; display: flex; justify-content: center; align-items: center; margin-bottom: 20px;
          transition: all 0.2s ease;
        }
        .toggle-btn:hover { background: rgba(255,255,255,0.1); color: var(--accent); }

        .sidebar-actions { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        
        .sidebar-link-admin, .sidebar-btn-public, .sidebar-link, .sidebar-btn-logout {
          display: flex; align-items: center; border-radius: 12px; padding: 10px;
          text-decoration: none; transition: all 0.2s ease; color: #a1a1aa; overflow: hidden;
        }
        
        .sidebar-panel.collapsed .sidebar-link-admin,
        .sidebar-panel.collapsed .sidebar-btn-public,
        .sidebar-panel.collapsed .sidebar-link,
        .sidebar-panel.collapsed .sidebar-btn-logout {
          justify-content: center; padding: 10px 0;
        }

        .sidebar-link-admin { background: rgba(255, 90, 31, 0.1); color: var(--accent); border: 1px solid var(--accent); font-weight: 700; }
        .sidebar-btn-public { background: var(--accent); color: #fff; font-weight: 700; }
        .sidebar-link:hover { background: rgba(255,255,255,0.05); color: #fff; }
        
        .sidebar-btn-logout { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; }
        .sidebar-panel.expanded .sidebar-btn-logout { justify-content: flex-start; }
        
        .nav-container { display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .sidebar-footer { margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }

        .user-profile { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 20px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: #fff; }
        .info .name { font-size: 0.9rem; font-weight: bold; }
        .info .role { font-size: 0.75rem; color: #71717a; }

        @media (max-width: 900px) {
          .sidebar-panel {
            width: 92% !important; max-width: 450px !important; height: 68px !important; position: fixed !important;
            bottom: 20px !important; left: 50% !important; transform: translateX(-50%) !important;
            border-radius: 50px !important; padding: 0 10px !important; flex-direction: row !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important; z-index: 9999 !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
          }
          
          .toggle-btn, .sidebar-header, .sidebar-actions, .sidebar-footer, .nav-label { display: none !important; }
          
          .sidebar-link { 
            flex-direction: column !important; justify-content: center; padding: 8px 15px !important; 
            font-size: 0.65rem !important; gap: 4px !important; min-width: 65px; text-align: center; 
          }
          
          .link-text { display: inline-block !important; margin-left: 0 !important; }
          
          .nav-container { 
            flex-direction: row !important; justify-content: flex-start !important; align-items: center !important; 
            overflow-x: auto !important; overflow-y: hidden !important; gap: 5px !important; height: 100% !important; 
          }
          .nav-container::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </aside>
  )
}

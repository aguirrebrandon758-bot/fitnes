import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClientPanel from './ClientPanel'

async function PanelContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isSuperAdmin = user.email?.toLowerCase().trim() === 'aguirrebrandon758@gmail.com'
  const { data: perfil } = await supabase.from('profiles').select('rol, nombre').eq('id', user.id).maybeSingle()
  const rol = isSuperAdmin ? 'admin' : (perfil?.rol || 'cliente')

  // ============================================
  // PANEL DE CLIENTE
  // ============================================
  if (rol === 'cliente') {
    const { data: relacion } = await supabase
      .from('gym_clientes')
      .select(`gym_id, rutina_asignada_id, dieta_asignada_id, gyms(id, nombre, sufijo, slug, color_primario, color_secundario)`)
      .eq('user_id', user.id).eq('activo', true).maybeSingle()

    if (!relacion) {
      return (
        <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
          <div className="container">
            <header style={{ marginBottom: '40px' }}><div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div></header>
            <div className="service-card" style={{ textAlign: 'center', padding: '60px 30px', borderColor: 'var(--accent)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔗</div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>No estás unido a un gym</h2>
              <Link href="/unirse" className="btn">🔑 Unirme con código</Link>
            </div>
          </div>
        </div>
      )
    }

    const gym = Array.isArray(relacion.gyms) ? relacion.gyms[0] : relacion.gyms
    const [{ data: ejercicios }, { data: videos }, { data: rutinaEjercicios }, { data: dieta }] = await Promise.all([
      supabase.from('ejercicios').select('id, nombre, grupo_muscular, dificultad, video_url').eq('gym_id', gym?.id).eq('activo', true),
      supabase.from('videos').select('id, titulo, youtube_id').eq('gym_id', gym?.id).eq('activo', true),
      relacion.rutina_asignada_id ? supabase.from('rutina_ejercicios').select(`dia, series, repeticiones, ejercicios (nombre, grupo_muscular)`).eq('rutina_id', relacion.rutina_asignada_id) : Promise.resolve({ data: [] }),
      relacion.dieta_asignada_id ? supabase.from('dietas').select('*').eq('id', relacion.dieta_asignada_id).maybeSingle() : Promise.resolve({ data: null })
    ])

    let rutinaAsignada = null
    if (relacion.rutina_asignada_id) {
      const { data } = await supabase.from('rutinas').select('id, nombre, objetivo, nivel').eq('id', relacion.rutina_asignada_id).maybeSingle()
      rutinaAsignada = data
    }

    return <ClientPanel user={user} gym={gym} ejercicios={ejercicios || []} videos={videos || []} rutinaAsignada={rutinaAsignada} detalleRutina={rutinaEjercicios || []} dietaAsignada={dieta} />
  }

  // ============================================
  // PANEL DE ENTRENADOR / ADMIN
  // ============================================
  
  let checkGym = null;
  if (isSuperAdmin) {
    const { data } = await supabase.from('gyms').select('*').eq('slug', 'gym-demo').maybeSingle()
    checkGym = data
    if (!checkGym) checkGym = { id: '0', nombre: 'Mi Gym (Modo Dios)', slug: 'gym-demo', color_primario: '#ff5a1f', color_secundario: '#ffb703' }
  } else {
    const { data } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle()
    checkGym = data
  }

  if (!checkGym) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="service-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center', borderColor: 'var(--accent)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>¡Bienvenido a FitPro!</h1>
          <form action="/api/crear-gym" method="POST" style={{ display: 'grid', gap: '15px', textAlign: 'left', marginTop: '20px' }}>
            <div><label>Nombre de tu Gym</label><input type="text" name="nombre" placeholder="Ej: FitZone" required style={{width:'100%', padding:'10px', background:'#222', color:'#fff', border:'1px solid #444', borderRadius:'8px'}}/></div>
            <div><label>URL de tu página</label><input type="text" name="slug" placeholder="Ej: fitzone" required style={{width:'100%', padding:'10px', background:'#222', color:'#fff', border:'1px solid #444', borderRadius:'8px'}}/></div>
            <button type="submit" className="btn" style={{ marginTop: '15px' }}>Crear mi Gimnasio</button>
          </form>
        </div>
      </div>
    )
  }

  const dynamicStyles = {
    '--accent': checkGym.color_primario || '#ff5a1f',
    '--accent-2': checkGym.color_secundario || '#ffb703',
  } as React.CSSProperties

  const [{ count: totalEj }, { count: totalRu }, { count: totalDi }, { count: totalVi }] = await Promise.all([
    supabase.from('ejercicios').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
    supabase.from('rutinas').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
    supabase.from('dietas').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
    supabase.from('videos').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
  ])

  const stats = [
    { label: 'Ejercicios', value: totalEj ?? 0, icon: '📋' },
    { label: 'Rutinas', value: totalRu ?? 0, icon: '🏋️' },
    { label: 'Dietas', value: totalDi ?? 0, icon: '🍏' },
    { label: 'Videos', value: totalVi ?? 0, icon: '🎥' },
  ]

  return (
    <div style={dynamicStyles}>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: 'system-ui' }}>
        
        {/* SIDEBAR LATERAL MEJORADO */}
        <aside className="sidebar-panel" style={{ 
          width: '280px', 
          background: '#111113', // Fondo un poco más claro que el main
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', padding: '30px 20px',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
          zIndex: 10
        }}>
          
          <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '40px', paddingLeft: '10px' }}>
            FIT<span style={{ color: 'var(--accent)' }}>PRO</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '10px' }}>Gestión</span>
            
            <Link href="/panel/clientes" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>👥</span> Clientes</Link>
            <Link href="/panel/mi-gym" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>🏢</span> Mi Gym</Link>
            <Link href="/panel/dietas" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>🍏</span> Dietas</Link>
            <Link href="/panel/galeria" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>📸</span> Galería</Link>
            <Link href="/panel/testimonios" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>💬</span> Testimonios</Link>

            <span style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '30px', marginBottom: '10px', paddingLeft: '10px' }}>Contenido</span>

            <Link href="/panel/ejercicios" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>📋</span> Ejercicios</Link>
            <Link href="/panel/rutinas" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>🏋️</span> Rutinas</Link>
            <Link href="/panel/videos" className="sidebar-link"><span style={{ fontSize: '1.2rem' }}>🎥</span> Videos</Link>
          </nav>

          {/* Espacio para que la música no tape los botones */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', paddingBottom: '80px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {isSuperAdmin && (
              <Link href="/admin" className="sidebar-link-admin">👑 Panel Admin</Link>
            )}
            <Link href={`/${checkGym.slug}`} className="sidebar-btn-public">🌐 Mi Página Pública</Link>
            <form action="/auth/signout" method="post" style={{ width: '100%' }}>
              <button type="submit" className="sidebar-btn-logout">Cerrar sesión</button>
            </form>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL CON FONDO GRADIENTE */}
        <main className="main-content" style={{ 
          flex: 1, 
          padding: '60px 50px', 
          overflowY: 'auto',
          background: 'radial-gradient(circle at 50% 0%, rgba(255,90,31,0.05) 0%, #09090b 60%)' // Fondo sutil
        }}>
          
          <header style={{ marginBottom: '50px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-1px' }}>Resumen General</h1>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Bienvenido de vuelta a <strong style={{ color: 'var(--accent)' }}>{checkGym.nombre} {checkGym.sufijo}</strong>.</p>
          </header>

          {/* GRILLA DE TARJETAS REDISEÑADA */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card" style={{ 
                background: 'linear-gradient(145deg, rgba(30,30,36,0.8) 0%, rgba(20,20,24,0.8) 100%)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '24px', 
                padding: '35px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease, borderColor 0.3s ease'
              }}>
                {/* Ícono gigante de fondo */}
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '7rem', opacity: 0.03, pointerEvents: 'none', transform: 'rotate(15deg)' }}>
                  {s.icon}
                </div>
                
                {/* Ícono en cajita */}
                <div style={{ fontSize: '1.5rem', marginBottom: '25px', background: 'rgba(255,255,255,0.05)', width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {s.icon}
                </div>
                
                <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: '#fff', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {s.value}
                </div>
                <div style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ESTILOS CSS */}
      <style>{`
        .sidebar-link {
          display: flex; align-items: center; gap: 12px; padding: 12px 15px;
          border-radius: 12px; color: #a1a1aa; text-decoration: none;
          font-weight: 600; font-size: 0.95rem; transition: all 0.2s ease;
        }
        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.05); color: #fff; transform: translateX(5px);
        }
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
          font-weight: 700; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: transform 0.2s;
        }
        .sidebar-btn-public:hover { transform: translateY(-2px); }
        .sidebar-btn-logout {
          width: 100%; background: transparent; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1);
          padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .sidebar-btn-logout:hover { background: rgba(255,255,255,0.05); color: #fff; }
        
        .stat-card:hover { 
          transform: translateY(-8px); 
          border-color: var(--accent) !important; 
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        
        @media (max-width: 900px) {
          .sidebar-panel { width: 100% !important; height: auto !important; position: relative !important; padding: 20px !important; padding-bottom: 20px !important; }
          .sidebar-panel nav { flex-direction: row !important; overflow-x: auto !important; padding-bottom: 10px !important; }
          .sidebar-link { white-space: nowrap; padding: 8px 15px !important; }
          .sidebar-panel > div:first-child { margin-bottom: 20px !important; }
          .sidebar-panel > div:last-child { border-top: none !important; flex-direction: row !important; flex-wrap: wrap !important; padding-bottom: 20px !important; }
          .main-content { padding: 30px 20px !important; }
        }
      `}</style>
    </div>
  )
}

export default function PanelPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', background: '#09090b' }}>Cargando panel...</div>}>
      <PanelContent />
    </Suspense>
  )
}

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClientPanel from './ClientPanel'
import CreateGymForm from './CreateGymForm' // 👈 Importamos el nuevo formulario

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
    checkGym = data || { id: '0', nombre: 'Mi Gym', slug: 'gym-demo', color_primario: '#ff5a1f', color_secundario: '#ffb703' }
  } else {
    const { data } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle()
    checkGym = data
  }

  if (!checkGym) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="service-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center', borderColor: 'var(--accent)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>¡Bienvenido a FitPro!</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Parece que es tu primera vez. Creá tu gimnasio para empezar.</p>
          
          {/* 👇 ACÁ USAMOS EL NUEVO FORMULARIO SEGURO 👇 */}
          <CreateGymForm />

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
    { label: 'Ejercicios', value: totalEj ?? 0, icon: '📋', color: '#3b82f6' },
    { label: 'Rutinas', value: totalRu ?? 0, icon: '🏋️', color: '#eab308' },
    { label: 'Dietas', value: totalDi ?? 0, icon: '🍏', color: '#22c55e' },
    { label: 'Videos', value: totalVi ?? 0, icon: '🎥', color: '#a855f7' },
  ]

  return (
    <div style={{ ...dynamicStyles, display: 'flex', minHeight: '100vh', background: '#09090b', color: '#fff', fontFamily: 'system-ui' }}>
      
      <aside className="custom-scrollbar sidebar-panel" style={{ 
        width: '280px', 
        background: '#0a0a0c', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', 
        padding: '30px 20px 20px 20px',
        overflowY: 'auto',
        zIndex: 10
      }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '30px', paddingLeft: '10px' }}>
          FIT<span style={{ color: 'var(--accent)' }}>PRO</span>
        </div>

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

      <main className="custom-scrollbar main-content" style={{ 
        flex: 1, 
        padding: '60px 50px', 
        overflowY: 'auto',
        background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)'
      }}>
        
        <div style={{ marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-1px' }}>Resumen General</h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Bienvenido de vuelta a <strong style={{ color: 'var(--accent)' }}>{checkGym.nombre} {checkGym.sufijo}</strong>.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
          {stats.map((s) => (
            <div key={s.label} className="stat-card" style={{ 
              background: 'rgba(20, 20, 24, 0.7)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '20px', 
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '1.5rem' }}>
                  {s.icon}
                </div>
                <div style={{ color: s.color, fontSize: '0.8rem', fontWeight: 700, background: `${s.color}20`, padding: '4px 10px', borderRadius: '50px' }}>
                  +{s.label}
                </div>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, marginBottom: '5px' }}>{s.value}</div>
              <div style={{ color: '#71717a', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>Total de {s.label}</div>
            </div>
          ))}
        </div>
      </main>

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

        @media (max-width: 900px) {
          .sidebar-panel { width: 100% !important; height: auto !important; position: relative !important; padding: 20px !important; }
          .sidebar-panel nav { flex-direction: row !important; overflow-x: auto !important; padding-bottom: 10px !important; }
          .sidebar-link { white-space: nowrap; padding: 8px 15px !important; }
          .sidebar-panel > div:first-child { margin-bottom: 20px !important; }
          .sidebar-panel > div:last-child { border-top: none !important; flex-direction: row !important; flex-wrap: wrap !important; }
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

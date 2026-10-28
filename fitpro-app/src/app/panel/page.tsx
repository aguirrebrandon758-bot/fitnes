import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientPanel from './ClientPanel'
import CreateGymForm from './CreateGymForm'

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
        <div style={{ padding: '40px 20px' }}>
          <div className="service-card" style={{ textAlign: 'center', padding: '60px 30px', borderColor: 'var(--accent)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔗</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>No estás unido a un gym</h2>
            <a href="/unirse" className="btn">🔑 Unirme con código</a>
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
      <div style={{ padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="service-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center', borderColor: 'var(--accent)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>¡Bienvenido a FitPro!</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>Parece que es tu primera vez. Creá tu gimnasio para empezar.</p>
          <CreateGymForm />
        </div>
      </div>
    )
  }

  const [{ count: totalEj }, { count: totalRu }, { count: totalDi }, { count: totalVi }] = await Promise.all([
    supabase.from('ejercicios').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
    supabase.from('rutinas').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
    supabase.from('dietas').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
    supabase.from('videos').select('*', { count: 'exact', head: true }).eq('gym_id', checkGym.id),
  ])

  // 👇 ACÁ CAMBIAMOS LOS EMOJIS POR LOS NUEVOS SVG 👇
  const stats = [
    { 
      label: 'Ejercicios', value: totalEj ?? 0, color: '#3b82f6', 
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12"></path><path d="M6 12h12"></path><path d="M6 16h12"></path><path d="M3 4v16"></path><path d="M21 4v16"></path></svg>
    },
    { 
      label: 'Rutinas', value: totalRu ?? 0, color: '#eab308', 
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
    { 
      label: 'Dietas', value: totalDi ?? 0, color: '#22c55e', 
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
    },
    { 
      label: 'Videos', value: totalVi ?? 0, color: '#a855f7', 
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
    },
  ]

  return (
    <div className="page-container">
      <div style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-1px' }}>Resumen General</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Bienvenido de vuelta a <strong style={{ color: 'var(--accent)' }}>{checkGym.nombre} {checkGym.sufijo}</strong>.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card" style={{ 
            background: 'rgba(20, 20, 24, 0.7)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '30px',
            display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              {/* 👇 ACÁ SE RENDERIZA EL ÍCONO SVG 👇 */}
              <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color, width: '55px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: `1px solid ${s.color}30`, transition: 'all 0.3s ease' }}>
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

      <style>{`
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.2) !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.4);
        }
        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 15px currentColor;
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

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

  // Si el layout vio que no hay gym, no deberíamos llegar acá, pero por las dudas:
  if (!checkGym) return null

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
    <div className="page-container">
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

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientPanel from './ClientPanel'
import CreateGymForm from './CreateGymForm'
import StatsCards from './StatsCards' // 👈 Importamos las nuevas tarjetas

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

  return (
    <div className="page-container">
      <div style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '10px', letterSpacing: '-1px' }}>Resumen General</h1>
        <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Bienvenido de vuelta a <strong style={{ color: 'var(--accent)' }}>{checkGym.nombre} {checkGym.sufijo}</strong>.</p>
      </div>

      {/* 👇 USAMOS EL NUEVO COMPONENTE ACÁ 👇 */}
      <StatsCards 
        totalEj={totalEj ?? 0} 
        totalRu={totalRu ?? 0} 
        totalDi={totalDi ?? 0} 
        totalVi={totalVi ?? 0} 
      />

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

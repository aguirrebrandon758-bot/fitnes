import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ClientPanel from './ClientPanel'

async function PanelContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: perfil } = await supabase.from('profiles').select('rol, nombre').eq('id', user.id).maybeSingle()
  const rol = perfil?.rol || 'cliente'

  // ============================================
  // PANEL DE CLIENTE
  // ============================================
  if (rol === 'cliente') {
    const { data: relacion } = await supabase
      .from('gym_clientes')
      .select(`gym_id, rutina_asignada_id, dieta_asignada_id, gyms(id, nombre, sufijo, slug)`)
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

    const [
      { data: ejercicios },
      { data: videos },
      { data: rutinaEjercicios },
      { data: dieta }
    ] = await Promise.all([
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
  // PANEL DE ENTRENADOR
  // ============================================
  const [{ count: totalEj }, { count: totalRu }, { count: totalDi }, { count: totalVi }] = await Promise.all([
    supabase.from('ejercicios').select('*', { count: 'exact', head: true }),
    supabase.from('rutinas').select('*', { count: 'exact', head: true }),
    supabase.from('dietas').select('*', { count: 'exact', head: true }),
    supabase.from('videos').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Ejercicios', value: totalEj ?? 0, color: 'var(--accent)' },
    { label: 'Rutinas', value: totalRu ?? 0, color: 'var(--accent-2)' },
    { label: 'Dietas', value: totalDi ?? 0, color: 'var(--accent)' },
    { label: 'Videos', value: totalVi ?? 0, color: 'var(--accent-2)' },
  ]

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        {/* HEADER ACTUALIZADO CON BOTÓN DE VOLVER AL INICIO */}
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href="/" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid #a1a1aa', color: '#a1a1aa' }}>
              🌐 Ver sitio público
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Cerrar sesión</button>
            </form>
          </div>
        </header>
        
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Resumen</h2>
        <div className="services-grid" style={{ marginBottom: '50px' }}>
          {stats.map((s) => (
            <div key={s.label} className="service-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <p style={{ color: 'var(--muted)', marginTop: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Acciones rápidas</h2>
        <div className="services-grid">
          <Link href="/panel/clientes" className="service-card" style={{ display: 'block', borderColor: 'var(--accent)' }}><h3>👥 Clientes</h3><p style={{ marginTop: '10px' }}>Asignar rutinas y dietas</p></Link>
          <Link href="/panel/mi-gym/editar" className="service-card" style={{ display: 'block', borderColor: 'var(--accent)' }}><h3>🏢 Mi Gym</h3><p style={{ marginTop: '10px' }}>Editar datos del gym</p></Link>
          <Link href="/panel/dietas" className="service-card" style={{ display: 'block' }}><h3>🍏 Dietas</h3><p style={{ marginTop: '10px' }}>Crear planes de alimentación</p></Link>
          
          {/* 👇 ACÁ ESTÁ LA TARJETA DE TESTIMONIOS 👇 */}
          <Link href="/panel/testimonios" className="service-card" style={{ display: 'block' }}>
            <h3>💬 Testimonios</h3>
            <p style={{ marginTop: '10px' }}>Cargar opiniones de alumnos</p>
          </Link>

          <Link href="/panel/ejercicios" className="service-card" style={{ display: 'block' }}><h3>📋 Ejercicios</h3><p style={{ marginTop: '10px' }}>Biblioteca de ejercicios</p></Link>
          <Link href="/panel/rutinas" className="service-card" style={{ display: 'block' }}><h3>🏋️ Rutinas</h3><p style={{ marginTop: '10px' }}>Ver rutinas y ejercicios</p></Link>
          <Link href="/panel/videos" className="service-card" style={{ display: 'block' }}><h3>🎥 Videos</h3><p style={{ marginTop: '10px' }}>Videos de técnicas</p></Link>
        </div>
      </div>
    </div>
  )
}

export default function PanelPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>Cargando panel...</div>}>
      <PanelContent />
    </Suspense>
  )
}

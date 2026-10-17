import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function PanelContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Leer el rol desde la tabla profiles
  const { data: perfil } = await supabase
    .from('profiles')
    .select('rol, nombre')
    .eq('id', user.id)
    .maybeSingle()

  const rol = perfil?.rol || 'cliente'

  // ============================================
  // PANEL DE CLIENTE
  // ============================================
  if (rol === 'cliente') {
    // Buscar el gym al que pertenece
    const { data: relacion } = await supabase
      .from('gym_clientes')
      .select('gym_id, gyms(id, nombre, sufijo, slug, color_primario)')
      .eq('user_id', user.id)
      .eq('activo', true)
      .maybeSingle()

    // Si NO está unido a ningún gym → mostrar mensaje
    if (!relacion) {
      return (
        <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
          <div className="container">
            <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Cerrar sesión</button>
                </form>
              </div>
            </header>
            <div style={{ marginBottom: '50px' }}>
              <h1 className="section-title">Hola de nuevo 👋</h1>
              <p style={{ color: 'var(--muted)' }}><strong style={{ color: 'var(--accent)' }}>{user.email}</strong></p>
            </div>
            <div className="service-card" style={{ textAlign: 'center', padding: '60px 30px', borderColor: 'var(--accent)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔗</div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>Todavía no estás unido a un gym</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px' }}>Pedile a tu entrenador el código de tu gimnasio para acceder a tu rutina, ejercicios y videos personalizados.</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/unirse" className="btn">🔑 Unirme con código</Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    const gym = Array.isArray(relacion.gyms) ? relacion.gyms[0] : relacion.gyms

    const [
      { data: ejercicios },
      { data: rutinas },
      { data: videos },
    ] = await Promise.all([
      supabase.from('ejercicios').select('id, nombre, grupo_muscular, dificultad').eq('gym_id', gym?.id).eq('activo', true).limit(6),
      supabase.from('rutinas').select('id, nombre, objetivo, nivel').eq('gym_id', gym?.id).eq('activo', true).limit(6),
      supabase.from('videos').select('id, titulo, youtube_id').eq('gym_id', gym?.id).eq('activo', true).limit(6),
    ])

    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container">
          <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div>
              <form action="/auth/signout" method="post">
                <button type="submit" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Cerrar sesión</button>
              </form>
            </div>
          </header>
          <div style={{ marginBottom: '50px' }}>
            <h1 className="section-title">Hola de nuevo 👋</h1>
            <p className="section-sub" style={{ marginBottom: '10px' }}>Bienvenido a <strong style={{ color: 'var(--accent)' }}>{gym?.nombre} {gym?.sufijo}</strong></p>
            <p style={{ color: 'var(--muted)' }}><strong>{user.email}</strong></p>
          </div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>📋 Ejercicios de tu gym</h2>
          {ejercicios && ejercicios.length > 0 ? (
            <div className="ejercicios-grid" style={{ marginBottom: '50px' }}>
              {ejercicios.map((e) => (
                <div key={e.id} className="ejercicio-card">
                  <span className="tag">{e.grupo_muscular}</span>
                  <h3>{e.nombre}</h3>
                  <div className="ejercicio-meta" style={{ marginTop: '10px' }}><span><strong>{e.dificultad}</strong></span></div>
                </div>
              ))}
            </div>
          ) : <p style={{ color: 'var(--muted)', marginBottom: '50px' }}>Tu gym todavía no cargó ejercicios.</p>}
          
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🏋️ Rutinas de tu gym</h2>
          {rutinas && rutinas.length > 0 ? (
            <div className="rutinas-grid" style={{ marginBottom: '50px' }}>
              {rutinas.map((r) => (
                <div key={r.id} className="rutina-card">
                  <span className="badge-nivel">{r.nivel}</span>
                  <h3>{r.nombre}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '8px' }}>🎯 {r.objetivo}</p>
                </div>
              ))}
            </div>
          ) : <p style={{ color: 'var(--muted)', marginBottom: '50px' }}>Tu gym todavía no cargó rutinas.</p>}
          
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>🎥 Videos de tu gym</h2>
          {videos && videos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {videos.map((v) => (
                <div key={v.id} className="service-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{v.titulo}</h3>
                  <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>▶ Ver video</p>
                </div>
              ))}
            </div>
          ) : <p style={{ color: 'var(--muted)' }}>Tu gym todavía no cargó videos.</p>}
        </div>
      </div>
    )
  }

  // ============================================
  // PANEL DE ENTRENADOR
  // ============================================
  const [
    { count: totalEjercicios },
    { count: totalRutinas },
    { count: totalAlimentos },
    { count: totalVideos },
  ] = await Promise.all([
    supabase.from('ejercicios').select('*', { count: 'exact', head: true }),
    supabase.from('rutinas').select('*', { count: 'exact', head: true }),
    supabase.from('alimentos').select('*', { count: 'exact', head: true }),
    supabase.from('videos').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Ejercicios', value: totalEjercicios ?? 0, color: 'var(--accent)' },
    { label: 'Rutinas', value: totalRutinas ?? 0, color: 'var(--accent-2)' },
    { label: 'Alimentos', value: totalAlimentos ?? 0, color: 'var(--accent)' },
    { label: 'Videos', value: totalVideos ?? 0, color: 'var(--accent-2)' },
  ]

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>Cerrar sesión</button>
            </form>
          </div>
        </header>
        <div style={{ marginBottom: '50px' }}>
          <h1 className="section-title">Panel de entrenador</h1>
          <p className="section-sub" style={{ marginBottom: '10px' }}>¡Bienvenido de vuelta!</p>
          <p style={{ color: 'var(--muted)' }}>Estás logueado como <strong style={{ color: 'var(--accent)' }}>{user.email}</strong></p>
        </div>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Resumen</h2>
        <div className="services-grid" style={{ marginBottom: '50px' }}>
          {stats.map((s) => (
            <div key={s.label} className="service-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <p style={{ color: 'var(--muted)', marginTop: '10px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Acciones rápidas</h2>
        <div className="services-grid">
          {/* AQUÍ ESTÁ EL BOTÓN NUEVO DE CLIENTES */}
          <Link href="/panel/clientes" className="service-card" style={{ display: 'block', borderColor: 'var(--accent)' }}>
            <h3>👥 Clientes</h3>
            <p style={{ marginTop: '10px' }}>Ver alumnos y asignar rutinas</p>
          </Link>
          
          <Link href="/panel/mi-gym" className="service-card" style={{ display: 'block', borderColor: 'var(--accent)' }}>
            <h3>🏢 Mi Gym</h3>
            <p style={{ marginTop: '10px' }}>Editar nombre, logo, colores y datos</p>
          </Link>
          <Link href="/panel/ejercicios" className="service-card" style={{ display: 'block' }}>
            <h3>📋 Ejercicios</h3>
            <p style={{ marginTop: '10px' }}>Ver biblioteca completa de ejercicios</p>
          </Link>
          <Link href="/panel/rutinas" className="service-card" style={{ display: 'block' }}>
            <h3>🏋️ Rutinas</h3>
            <p style={{ marginTop: '10px' }}>Ver rutinas y sus ejercicios</p>
          </Link>
          <Link href="/panel/alimentos" className="service-card" style={{ display: 'block' }}>
            <h3>🍎 Alimentos</h3>
            <p style={{ marginTop: '10px' }}>Guía nutricional completa</p>
          </Link>
          <Link href="/panel/videos" className="service-card" style={{ display: 'block' }}>
            <h3>🎥 Videos</h3>
            <p style={{ marginTop: '10px' }}>Videos de técnicas y rutinas</p>
          </Link>
          <Link href="/" className="service-card" style={{ display: 'block' }}>
            <h3>🌐 Ver sitio público</h3>
            <p style={{ marginTop: '10px' }}>Ir a la página principal del gimnasio</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PanelPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Cargando panel...
      </div>
    }>
      <PanelContent />
    </Suspense>
  )
}

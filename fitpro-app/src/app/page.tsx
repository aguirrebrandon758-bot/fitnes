import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: 'system-ui', 
      overflow: 'hidden',
      background: '#09090b'
    }}>
      
      {/* NAVBAR CORREGIDA PARA MÓVILES */}
      <nav style={{ 
        position: 'fixed', 
        top: '15px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 30px)', // Un poco más de margen en celus
        maxWidth: '1200px',
        background: 'rgba(20, 20, 24, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '10px 15px', // Menos padding en celus
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        
        {/* Logo un poco más chico en celus */}
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>
          FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/login" className="nav-btn-login" style={{ 
            color: '#e4e4e7', 
            textDecoration: 'none', 
            fontWeight: 600, 
            borderRadius: '10px',
            whiteSpace: 'nowrap' // 👈 Evita que el texto se corte en varias líneas
          }}>
            Iniciar sesión
          </Link>
          
          <Link href="/registro" className="nav-btn-register" style={{ 
            background: 'linear-gradient(135deg, #ff5a1f, #ff8c00)',
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: '12px', 
            fontWeight: 700, 
            boxShadow: '0 4px 15px rgba(255,90,31,0.3)',
            whiteSpace: 'nowrap', // 👈 Evita que el texto se corte
            textAlign: 'center'
          }}>
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* HERO SECTION CON VIDEO DE FONDO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 15px', overflow: 'hidden' }}>
        
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, zIndex: 0
          }}
        >
          <source src="/video-default.mp4" type="video/mp4" />
        </video>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(9,9,11,0.4) 0%, rgba(9,9,11,0.8) 100%)', zIndex: 1 }} />

        <div style={{ maxWidth: '800px', zIndex: 2, paddingTop: '80px' }}>
          <span style={{ 
            background: 'rgba(255,90,31,0.15)', color: '#ff5a1f', padding: '6px 14px', 
            borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, 
            border: '1px solid rgba(255,90,31,0.3)', backdropFilter: 'blur(5px)',
            display: 'inline-block', marginBottom: '20px'
          }}>
            🚀 La plataforma #1 para gimnasios
          </span>
          
          {/* Título ajustado para que no sea gigante en celular */}
          <h1 className="hero-title" style={{ 
            fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', // 👈 Reduje el tamaño mínimo
            fontWeight: 900, 
            lineHeight: 1.1, 
            marginBottom: '20px', 
            textShadow: '0 4px 20px rgba(0,0,0,0.5)' 
          }}>
            Lleva tu gimnasio al <br/> <span style={{ color: '#ff5a1f' }}>siguiente nivel.</span>
          </h1>
          
          <p style={{ fontSize: '1.05rem', color: '#e4e4e7', maxWidth: '600px', margin: '0 auto 35px auto', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Gestioná rutinas, dietas, alumnos y tu propia página web personalizada. Todo en una sola plataforma rápida y moderna.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/registro" style={{ background: '#ff5a1f', color: '#fff', textDecoration: 'none', padding: '16px 40px', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(255,90,31,0.4)', transition: 'transform 0.2s', display: 'inline-block' }}>
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '80px 20px', position: 'relative', background: '#09090b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '15px' }}>Todo lo que necesitás</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>Diseñado para entrenadores que quieren profesionalizar su servicio.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>👥</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Gestión de Alumnos</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5, fontSize: '0.95rem' }}>Administrá a todos tus clientes, asignales rutinas y dietas con un solo clic.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📋</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Rutinas Inteligentes</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5, fontSize: '0.95rem' }}>Creá rutinas con series, repeticiones o tiempo. Asigná videos y ejercicios.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🌐</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Página Pública</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5, fontSize: '0.95rem' }}>Cada entrenador tiene su propia web (ej: fitpro.com/tu-gym) con sus colores.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🎵</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>Reproductor Musical</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5, fontSize: '0.95rem' }}>Tus alumnos entrenan con la música de fondo que vos elijas. ¡Puro hype!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '80px 20px', background: 'linear-gradient(to bottom, #09090b, rgba(23, 23, 27, 0.5))', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '20px' }}>¿Listo para despegar?</h2>
        <p style={{ color: '#a1a1aa', fontSize: '1rem', marginBottom: '30px' }}>Unite a la plataforma que está revolucionando la gestión de gimnasios.</p>
        <Link href="/registro" style={{ background: 'linear-gradient(135deg, #ff5a1f, #ff8c00)', color: '#fff', textDecoration: 'none', padding: '16px 30px', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', display: 'inline-block', boxShadow: '0 10px 30px rgba(255,90,31,0.4)' }}>
          Crear mi cuenta gratis
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#a1a1aa' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>FIT<span style={{ color: '#ff5a1f' }}>PRO</span></div>
        <p style={{ fontSize: '0.9rem' }}>© {new Date().getFullYear()} FitPro. Todos los derechos reservados.</p>
      </footer>

      {/* CSS EXTRA PARA CELULARES */}
      <style>{`
        @media (max-width: 500px) {
          .nav-btn-login { font-size: 0.8rem !important; padding: 8px 10px !important; }
          .nav-btn-register { font-size: 0.8rem !important; padding: 8px 12px !important; }
          .logo { font-size: 1.3rem !important; }
          .hero-title br { display: none; } /* Quita el salto de línea forzado en celus para que fluya mejor */
        }
      `}</style>

    </div>
  )
}

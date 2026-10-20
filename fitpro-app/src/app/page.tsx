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
      
      {/* NAVBAR FLOTANTE ESTILO GLASSMORPHISM */}
      <nav style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '1200px',
        background: 'rgba(20, 20, 24, 0.6)', // Fondo semitransparente
        backdropFilter: 'blur(20px)',       // Efecto vidrio esmerilado
        border: '1px solid rgba(255, 255, 255, 0.08)', // Borde sutil
        borderRadius: '20px',               // Bordes bien redondeados
        padding: '12px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 100,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' // Sombra flotante
      }}>
        {/* Logo */}
        <div className="logo" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>
          FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{ 
            color: '#e4e4e7', 
            textDecoration: 'none', 
            padding: '10px 20px', 
            fontWeight: 600, 
            fontSize: '0.95rem',
            borderRadius: '10px',
            transition: 'background 0.2s'
          }}>
            Iniciar sesión
          </Link>
          
          <Link href="/registro" style={{ 
            background: 'linear-gradient(135deg, #ff5a1f, #ff8c00)', // Degradado naranja
            color: '#fff', 
            textDecoration: 'none', 
            padding: '10px 24px', 
            borderRadius: '12px', 
            fontWeight: 700, 
            fontSize: '0.95rem', 
            boxShadow: '0 4px 15px rgba(255,90,31,0.3)',
            transition: 'transform 0.2s'
          }}>
            Crear cuenta gratis
          </Link>
        </div>
      </nav>

      {/* HERO SECTION CON VIDEO DE FONDO */}
      <section style={{ position: 'relative', minHeight: '120vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', overflow: 'hidden' }}>
        
        {/* VIDEO DE FONDO */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.65,
            zIndex: 0
          }}
        >
          <source src="/video-default.mp4" type="video/mp4" />
        </video>

        {/* CAPA OSCURA */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.3) 0%, rgba(9,9,11,0.5) 50%, #09090b 100%)', 
          zIndex: 1 
        }} />

        {/* CONTENIDO DEL HERO */}
        <div style={{ maxWidth: '800px', zIndex: 2, paddingTop: '80px' }}>
          <span style={{ background: 'rgba(255,90,31,0.15)', color: '#ff5a1f', padding: '6px 16px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(255,90,31,0.3)', backdropFilter: 'blur(5px)' }}>🚀 La plataforma #1 para gimnasios</span>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginTop: '20px', marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Lleva tu gimnasio al <br/> <span style={{ color: '#ff5a1f' }}>siguiente nivel.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#e4e4e7', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Gestioná rutinas, dietas, alumnos y tu propia página web personalizada. Todo en una sola plataforma rápida y moderna.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/registro" style={{ background: '#ff5a1f', color: '#fff', textDecoration: 'none', padding: '16px 40px', borderRadius: '12px', fontWeight: 700, fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(255,90,31,0.4)', transition: 'transform 0.2s' }}>Empezar ahora</Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '100px 20px', position: 'relative', background: '#09090b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '15px' }}>Todo lo que necesitás, en un solo lugar</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Diseñado para entrenadores que quieren profesionalizar su servicio.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>👥</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Gestión de Alumnos</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>Administrá a todos tus clientes, asignales rutinas y dietas con un solo clic.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📋</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Rutinas Inteligentes</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>Creá rutinas con series, repeticiones o tiempo. Asigná videos y ejercicios.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🍎</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Planes Nutricionales</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>Base de datos de alimentos y dietas personalizadas para cada objetivo.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🌐</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Tu Página Pública</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>Cada entrenador tiene su propia web (ej: fitpro.com/tu-gym) con sus colores.</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🎵</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>Reproductor Musical</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>Tus alumnos entrenan con la música de fondo que vos elijas. ¡Puro hype!</p>
            </div>
            <div style={{ background: 'rgba(23, 23, 27, 0.8)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>📱</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>100% Adaptable</h3>
              <p style={{ color: '#a1a1aa', lineHeight: 1.5 }}>Tus alumnos pueden ver sus rutinas y videos desde el celular en el mismo gimnasio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '100px 20px', background: 'linear-gradient(to bottom, #09090b, rgba(23, 23, 27, 0.5))', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>¿Listo para despegar?</h2>
        <p style={{ color: '#a1a1aa', fontSize: '1.2rem', marginBottom: '40px' }}>Unite a la plataforma que está revolucionando la gestión de gimnasios.</p>
        <Link href="/registro" style={{ background: 'linear-gradient(135deg, #ff5a1f, #ff8c00)', color: '#fff', textDecoration: 'none', padding: '18px 40px', borderRadius: '12px', fontWeight: 800, fontSize: '1.2rem', display: 'inline-block', boxShadow: '0 10px 30px rgba(255,90,31,0.4)' }}>
          Crear mi cuenta gratis
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#a1a1aa' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>FIT<span style={{ color: '#ff5a1f' }}>PRO</span></div>
        <p>© {new Date().getFullYear()} FitPro. Todos los derechos reservados.</p>
      </footer>

    </div>
  )
}

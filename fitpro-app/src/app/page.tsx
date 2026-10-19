import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0e0e10' }}>
      
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
          opacity: 0.4,
          zIndex: 0
        }}
      >
        <source src="/video-default.mp4" type="video/mp4" />
      </video>

      {/* CONTENIDO SOBRE EL VIDEO */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '20px', maxWidth: '800px' }}>
        <div className="logo" style={{ fontSize: '3.5rem', marginBottom: '20px', color: '#fff' }}>
          FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
        </div>
        
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>
          Lleva tu gimnasio al <br /> <span style={{ color: '#ff5a1f' }}>siguiente nivel.</span>
        </h1>
        
        <p style={{ color: '#d4d4d8', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Gestioná rutinas, dietas, ejercicios y clientes desde una sola plataforma. Profesional, rápido y en la nube.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/registro" className="btn" style={{ padding: '14px 30px', fontSize: '1.1rem' }}>
            Empezar gratis
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ padding: '14px 30px', fontSize: '1.1rem' }}>
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

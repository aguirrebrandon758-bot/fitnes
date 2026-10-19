import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0e0e10', color: '#fff', fontFamily: 'system-ui' }}>
      
      {/* SECCIÓN DE PRUEBA DE VIDEO */}
      <div style={{ width: '100%', height: '400px', background: '#000', position: 'relative' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          {/* Usamos la URL directa de GitHub (raw) que es 100% accesible para el navegador */}
          <source src="https://raw.githubusercontent.com/aguirrebrandon758-bot/fitnes/main/fitpro-app/public/video-default.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontSize: '2rem' }}>¡Si ves este video, funciona!</h1>
        </div>
      </div>

      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>FitPro</h1>
        <p style={{ marginTop: '20px' }}>
          <Link href="/login" style={{ color: '#ff5a1f', marginRight: '20px' }}>Login</Link>
          <Link href="/registro" style={{ color: '#ff5a1f' }}>Registro</Link>
        </p>
      </div>

    </div>
  )
}

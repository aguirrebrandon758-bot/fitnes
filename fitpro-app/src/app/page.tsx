import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header style={{ position: 'absolute', background: 'transparent', borderBottom: 'none' }}>
        <nav>
          <div className="logo">
            FIT<span>PRO</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/login" className="btn btn-sm" style={{ background: 'transparent', color: 'var(--text)' }}>
              Iniciar sesión
            </Link>
            <Link href="/registro" className="btn btn-sm">
              Crear cuenta
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
            <section className="hero-parallax">
        <div className="container hero-content">
          <h1>
            Gestiona tu gimnasio de forma <span>profesional</span>
          </h1>
          <p>
            FitPro es la plataforma para administrar ejercicios, rutinas, alimentos y videos.
            Todo en un solo lugar, accesible desde cualquier dispositivo.
          </p>
          <div className="hero-actions">
            <Link href="/registro" className="btn">
              Empezar gratis
            </Link>
            <Link href="/login" className="btn btn-outline">
              Ya tengo cuenta
            </Link>
          </div>

          <div className="badges">
            <div className="badge">
              <strong>Fácil</strong>
              Gestión simple
            </div>
            <div className="badge">
              <strong>Rápido</strong>
              Todo en la nube
            </div>
            <div className="badge">
              <strong>Seguro</strong>
              Con Supabase
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="services">
        <div className="container">
          <h2 className="section-title">¿Qué podés hacer con FitPro?</h2>
          <p className="section-sub">
            Todo lo que necesitás para gestionar tu gimnasio, en una sola app.
          </p>

          <div className="services-grid">
            <div className="service-card">
              <h3>📋 Ejercicios</h3>
              <p>
                Creá y organizá tu biblioteca de ejercicios por grupo muscular,
                dificultad y equipamiento.
              </p>
            </div>
            <div className="service-card">
              <h3>🏋️ Rutinas</h3>
              <p>
                Armá rutinas personalizadas para cada objetivo. Asigná ejercicios,
                series y repeticiones.
              </p>
            </div>
            <div className="service-card">
              <h3>🍎 Alimentos</h3>
              <p>
                Base de datos nutricional con macros por porción. Base perfecta
                para armar planes.
              </p>
            </div>
            <div className="service-card">
              <h3>🎥 Videos</h3>
              <p>
                Cargá videos de técnica y demostraciones. Tus clientes acceden
                desde cualquier dispositivo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">¿Listo para empezar?</h2>
          <p className="section-sub" style={{ margin: '0 auto 40px' }}>
            Creá tu cuenta gratis y empezá a gestionar tu gimnasio hoy mismo.
          </p>
          <Link href="/registro" className="btn" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="logo">
              FIT<span>PRO</span>
            </div>
            <p>Plataforma de gestión para gimnasios.</p>
          </div>
          <div>
            <h4>Producto</h4>
            <Link href="/login">Iniciar sesión</Link>
            <Link href="/registro">Crear cuenta</Link>
          </div>
          <div>
            <h4>Contacto</h4>
            <a href="mailto:hola@fitpro.com">hola@fitpro.com</a>
          </div>
        </div>
        <p className="copy">© 2026 FitPro. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

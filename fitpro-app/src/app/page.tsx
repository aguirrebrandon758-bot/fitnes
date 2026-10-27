import Link from 'next/link'

export default function Home() {
  const features = [
    { 
      title: 'Gestión de Alumnos', 
      desc: 'Administrá a todos tus clientes, asignales rutinas y dietas con un solo clic.',
      color: '#3b82f6',
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    },
    { 
      title: 'Rutinas Inteligentes', 
      desc: 'Creá rutinas con series, repeticiones o tiempo. Asigná videos y ejercicios.',
      color: '#eab308',
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path></svg>
    },
    { 
      title: 'Planes Nutricionales', 
      desc: 'Base de datos de alimentos y dietas personalizadas para cada objetivo.',
      color: '#22c55e',
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
    },
    { 
      title: 'Tu Página Pública', 
      desc: 'Cada entrenador tiene su propia web (ej: fitpro.com/tu-gym) con sus colores.',
      color: '#a855f7',
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
    },
    { 
      title: 'Reproductor Musical', 
      desc: 'Tus alumnos entrenan con la música de fondo que vos elijas. ¡Puro hype!',
      color: '#ec4899',
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
    },
    { 
      title: '100% Adaptable', 
      desc: 'Tus alumnos pueden ver sus rutinas y videos desde el celular en el mismo gimnasio.',
      color: '#f97316',
      icon: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
    }
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      color: '#fff', 
      fontFamily: 'system-ui', 
      overflow: 'hidden',
      background: '#09090b'
    }}>
      
      <nav style={{ 
        position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 30px)', maxWidth: '1200px',
        background: 'rgba(20, 20, 24, 0.7)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px',
        padding: '10px 15px', display: 'flex', justifyContent: 'space-between', 
        alignItems: 'center', zIndex: 100, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px', display: 'flex', alignItems: 'center' }}>
          FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/login" className="nav-btn-login" style={{ 
            color: '#e4e4e7', textDecoration: 'none', fontWeight: 600, 
            borderRadius: '10px', whiteSpace: 'nowrap'
          }}>
            Iniciar sesión
          </Link>
          
          <Link href="/registro" className="nav-btn-register" style={{ 
            background: 'linear-gradient(135deg, #ff5a1f, #ff8c00)', color: '#fff', 
            textDecoration: 'none', borderRadius: '12px', fontWeight: 700, 
            boxShadow: '0 4px 15px rgba(255,90,31,0.3)', whiteSpace: 'nowrap', textAlign: 'center'
          }}>
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* HERO SECTION CON DEGRADADO CORREGIDO HACIA ABAJO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 15px', overflow: 'hidden' }}>
        <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.65, zIndex: 0 }}>
          <source src="/video-default.mp4" type="video/mp4" />
        </video>
        
        {/* 👇 ACÁ ESTÁ LA MAGIA: El degradado termina en #09090b (negro puro) 👇 */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(9,9,11,0.3) 0%, rgba(9,9,11,0.7) 60%, #09090b 100%)', 
          zIndex: 1 
        }} />

        <div style={{ maxWidth: '800px', zIndex: 2, paddingTop: '80px' }}>
          <span style={{ background: 'rgba(255,90,31,0.15)', color: '#ff5a1f', padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(255,90,31,0.3)', backdropFilter: 'blur(5px)', display: 'inline-block', marginBottom: '20px' }}>
            🚀 La plataforma #1 para gimnasios
          </span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Lleva tu gimnasio al <br/> <span style={{ color: '#ff5a1f' }}>siguiente nivel.</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#e4e4e7', maxWidth: '600px', margin: '0 auto 35px auto', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Gestioná rutinas, dietas, alumnos y tu propia página web personalizada. Todo en una sola plataforma rápida y moderna.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/registro" style={{ background: '#ff5a1f', color: '#fff', textDecoration: 'none', padding: '16px 40px', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(255,90,31,0.4)', display: 'inline-block' }}>
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (El fondo ya es #09090b, así que empalma perfecto) */}
      <section style={{ padding: '100px 20px', position: 'relative', background: '#09090b' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,90,31,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '15px' }}>Todo lo que necesitás</h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>Diseñado para entrenadores que quieren profesionalizar su servicio.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {features.map((f, i) => (
              <div 
                key={i} 
                className="feature-card"
                style={{
                  '--card-color': f.color,
                  '--card-glow': `${f.color}15`,
                  background: 'linear-gradient(145deg, rgba(30, 30, 36, 0.8) 0%, rgba(20, 20, 24, 0.9) 100%)',
                  padding: '35px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease'
                } as React.CSSProperties}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(to right, transparent, ${f.color}, transparent)`, opacity: 0.7 }}></div>
                
                <div className="feature-icon" style={{ 
                  color: f.color, 
                  backgroundColor: `${f.color}15`, 
                  border: `1px solid ${f.color}30`,
                  width: '64px', height: '64px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  borderRadius: '16px', marginBottom: '25px',
                  transition: 'all 0.3s ease'
                }}>
                  {f.icon}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: '#a1a1aa', lineHeight: 1.6, fontSize: '1rem' }}>{f.desc}</p>
              </div>
            ))}
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

      {/* CSS PARA EL EFECTO HOVER Y RESPONSIVE */}
      <style>{`
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: var(--card-color) !important;
          background: linear-gradient(145deg, var(--card-glow) 0%, rgba(20, 20, 24, 0.95) 100%) !important;
          box-shadow: 0 20px 40px var(--card-glow);
        }
        
        .feature-card:hover .feature-icon {
          transform: scale(1.1);
          background-color: var(--card-glow) !important;
        }

        @media (max-width: 500px) {
          .nav-btn-login { font-size: 0.8rem !important; padding: 8px 10px !important; }
          .nav-btn-register { font-size: 0.8rem !important; padding: 8px 12px !important; }
          .logo { font-size: 1.3rem !important; }
          .hero-title br { display: none; }
        }
      `}</style>

    </div>
  )
}

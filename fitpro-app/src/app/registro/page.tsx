'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegistroPage() {
  const router = useRouter()
  const supabase = createClient()

  const [rol, setRol] = useState<'entrenador' | 'cliente' | ''>('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMensaje('')
    if (!rol) { setError('Elegí si sos entrenador o cliente.'); return }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { rol: rol } },
    })

    if (error) { setError(error.message); setLoading(false); return }
    setMensaje('¡Cuenta creada! Revisá tu email para confirmar.')
    setLoading(false)
    setTimeout(() => router.push('/login'), 4000)
  }

  const bgColor = rol === 'entrenador' ? '#ff5a1f' : rol === 'cliente' ? '#3b82f6' : '#0e0e10'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', background: '#0e0e10' }}>
      
      {/* Lado Izquierdo: LOS 3 VIDEOS SUPERPUESTOS */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        display: 'none',
        overflow: 'hidden',
        backgroundColor: bgColor,
        transition: 'background-color 0.8s ease'
      }}
      className="register-video-panel"
      >
        {/* Video por defecto */}
        <video 
          autoPlay loop muted playsInline 
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'opacity 1s ease',
            opacity: rol === '' ? 0.9 : 0, // Se muestra solo si no hay rol
          }}
        >
          <source src="/video-default.mp4" type="video/mp4" />
        </video>

        {/* Video Entrenador */}
        <video 
          autoPlay loop muted playsInline 
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'opacity 1s ease, transform 1.5s ease',
            opacity: rol === 'entrenador' ? 0.7 : 0, // Se muestra solo si es entrenador
            transform: rol === 'entrenador' ? 'scale(1.1)' : 'scale(1)',
            filter: 'sepia(1) hue-rotate(-30deg) saturate(3)' // Tinte naranja
          }}
        >
          <source src="/video-entrenador.mp4" type="video/mp4" />
        </video>

        {/* Video Cliente */}
        <video 
          autoPlay loop muted playsInline 
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            transition: 'opacity 1s ease, transform 1.5s ease',
            opacity: rol === 'cliente' ? 0.7 : 0, // Se muestra solo si es cliente
            transform: rol === 'cliente' ? 'scale(1.1)' : 'scale(1)',
            filter: 'hue-rotate(180deg) saturate(1.5)' // Tinte azul
          }}
        >
          <source src="/video-cliente.mp4" type="video/mp4" />
        </video>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(14,14,16,0.4) 0%, rgba(14,14,16,0.6) 60%, #0e0e10 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div className="logo" style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#fff' }}>FIT<span style={{ color: '#ff5a1f' }}>PRO</span></div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '20px', transition: 'all 0.5s' }}>
            {rol === 'entrenador' ? 'Lidera tu propio equipo.' : rol === 'cliente' ? 'Alcanza tu mejor versión.' : 'Tu transformación empieza hoy.'}
          </h1>
          <p style={{ color: '#fff', fontSize: '1.2rem', maxWidth: '400px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            {rol === 'entrenador' 
              ? 'Gestioná rutinas, dietas y clientes desde una sola plataforma.' 
              : rol === 'cliente' 
              ? 'Accedé a tu rutina personalizada y planes de alimentación.'
              : 'Elegí cómo querés usar FitPro y empezá a cambiar tu vida.'}
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '20px', 
        position: 'relative', 
        zIndex: 2,
        background: `radial-gradient(circle at 50% 50%, ${bgColor}22 0%, #0e0e10 70%)`,
        transition: 'background 0.8s ease'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '480px',
          background: 'rgba(23, 23, 27, 0.4)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div className="logo" style={{ fontSize: '2rem', marginBottom: '20px', display: 'block', color: '#fff' }}>
              FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Creá tu cuenta</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
            <div
              onClick={() => setRol('entrenador')}
              style={{
                padding: '20px 15px', borderRadius: '12px',
                border: rol === 'entrenador' ? '2px solid #ff5a1f' : '1px solid rgba(255,255,255,0.1)',
                background: rol === 'entrenador' ? 'rgba(255, 90, 31, 0.15)' : 'rgba(0,0,0,0.2)',
                cursor: 'pointer', transition: 'all 0.3s', transform: rol === 'entrenador' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏋️</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '5px', color: '#fff' }}>Entrenador</h3>
            </div>

            <div
              onClick={() => setRol('cliente')}
              style={{
                padding: '20px 15px', borderRadius: '12px',
                border: rol === 'cliente' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                background: rol === 'cliente' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0,0,0,0.2)',
                cursor: 'pointer', transition: 'all 0.3s', transform: rol === 'cliente' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🧍</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '5px', color: '#fff' }}>Cliente</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Correo Electrónico</label>
              <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Contraseña (mín. 6)</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
            </div>

            {error && <div style={{ padding: '12px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5' }}>{error}</div>}
            {mensaje && <div style={{ padding: '12px', background: 'rgba(34,197,94,.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#86efac' }}>{mensaje}</div>}

            <button type="submit" className="btn" disabled={loading || !rol} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
              {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>

          <p style={{ marginTop: '30px', textAlign: 'center', color: '#a1a1aa' }}>
            ¿Ya tenés cuenta? <Link href="/login" style={{ color: '#ff5a1f', fontWeight: 'bold' }}>Iniciá sesión</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .register-video-panel { display: flex !important; }
          .logo { display: none !important; }
          @media (min-width: 900px) {
            .register-video-panel .logo { display: block !important; }
          }
        }
      `}</style>
    </div>
  )
}

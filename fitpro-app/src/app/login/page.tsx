'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const rol = user?.user_metadata?.rol

    if (rol === 'cliente') {
      router.push('/panel')
    } else {
      router.push('/panel/mi-gym')
    }
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', background: '#0e0e10' }}>
      
      {/* PRECARGA DE VIDEO */}
      <div style={{ display: 'none' }}>
        <video preload="auto" src="/video-default.mp4" />
      </div>

      {/* Lado Izquierdo: VIDEO */}
      <div style={{ flex: 1, position: 'relative', display: 'none', overflow: 'hidden' }} className="login-video-panel">
        <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/video-default.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14,14,16,0.4), rgba(14,14,16,0.8))' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div className="logo" style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#fff' }}>FIT<span style={{ color: '#ff5a1f' }}>PRO</span></div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>
            Bienvenido <br/><span style={{ color: '#ff5a1f' }}>al siguiente nivel.</span>
          </h1>
          <p style={{ color: '#d4d4d8', fontSize: '1.2rem', maxWidth: '400px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Entrenamiento, nutrición y gestión en un solo lugar.
          </p>
        </div>
      </div>

      {/* Lado Derecho: Formulario con Fondo Gradiente */}
      <div style={{ 
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 2,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 90, 31, 0.1) 0%, #0e0e10 70%)'
      }}>
        <div style={{ 
          width: '100%', maxWidth: '420px',
          background: 'rgba(23, 23, 27, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="logo" style={{ fontSize: '2rem', marginBottom: '20px', display: 'block', color: '#fff' }}>FIT<span style={{ color: '#ff5a1f' }}>PRO</span></div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Iniciar sesión</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Correo</label>
              <input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Contraseña</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} />
            </div>

            {error && <div style={{ padding: '12px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>{error}</div>}

            <button type="submit" className="btn" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
              {loading ? 'Ingresando...' : 'Entrar a mi cuenta'}
            </button>
          </form>

          <p style={{ marginTop: '30px', textAlign: 'center', color: '#a1a1aa' }}>
            ¿No tenés cuenta? <Link href="/registro" style={{ color: '#ff5a1f', fontWeight: 'bold' }}>Registrate</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-video-panel { display: flex !important; }
          .logo { display: none !important; }
          @media (min-width: 900px) {
            .login-video-panel .logo { display: block !important; }
          }
        }
      `}</style>
    </div>
  )
}

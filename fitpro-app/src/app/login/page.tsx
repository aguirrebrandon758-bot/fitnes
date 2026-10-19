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
  const [focusInput, setFocusInput] = useState(false)

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0e0e10', overflow: 'hidden' }}>
      
      <div style={{ 
        flex: 1, 
        position: 'relative',
        display: 'none',
        overflow: 'hidden'
      }}
      className="login-video-panel"
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: focusInput ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 2s ease'
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-man-lifting-a-heavy-barbell-in-the-gym-2321-large.mp4" type="video/mp4" />
        </video>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(14,14,16,0.6), rgba(14,14,16,0.9))' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div className="logo" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>FIT<span>PRO</span></div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>
            Bienvenido <br/><span style={{ color: 'var(--accent)' }}>al siguiente nivel.</span>
          </h1>
          <p style={{ color: '#d4d4d8', fontSize: '1.2rem', maxWidth: '400px' }}>
            Entrenamiento, nutrición y gestión en un solo lugar.
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="logo" style={{ fontSize: '2rem', marginBottom: '20px', display: 'block' }}>FIT<span>PRO</span></div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Iniciar sesión</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Correo</label>
              <input 
                type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} 
                onFocus={() => setFocusInput(true)} onBlur={() => setFocusInput(false)} required 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#17171b', border: '1px solid #2a2a32', color: '#fff' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px', display: 'block' }}>Contraseña</label>
              <input 
                type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} 
                onFocus={() => setFocusInput(true)} onBlur={() => setFocusInput(false)} required 
                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#17171b', border: '1px solid #2a2a32', color: '#fff' }} 
              />
            </div>

            {error && <div style={{ padding: '12px', background: 'rgba(230,74,16,.1)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>{error}</div>}

            <button type="submit" className="btn" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
              {loading ? 'Ingresando...' : 'Entrar a mi cuenta'}
            </button>
          </form>

          <p style={{ marginTop: '30px', textAlign: 'center', color: 'var(--muted)' }}>
            ¿No tenés cuenta? <Link href="/registro" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Registrate</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>← Volver al inicio</Link>
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

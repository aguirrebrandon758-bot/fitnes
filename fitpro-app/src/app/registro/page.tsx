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

    if (!rol) {
      setError('Elegí si sos entrenador o cliente.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          rol: rol,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMensaje('¡Cuenta creada! Revisá tu email para confirmar, o iniciá sesión directamente.')
    setLoading(false)
    setTimeout(() => router.push('/login'), 4000)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="container" style={{ maxWidth: '560px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo" style={{ fontSize: '2rem' }}>
            FIT<span>PRO</span>
          </div>
          <h1 className="section-title" style={{ marginTop: '20px', fontSize: '1.8rem' }}>
            Crear cuenta
          </h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Elegí cómo querés usar FitPro
          </p>
        </div>

        {/* Selector de rol */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div
            onClick={() => setRol('entrenador')}
            style={{
              padding: '25px 20px',
              borderRadius: '14px',
              border: rol === 'entrenador' ? '2px solid var(--accent)' : '2px solid #2a2a32',
              background: rol === 'entrenador' ? 'rgba(255, 90, 31, 0.1)' : 'var(--card)',
              cursor: 'pointer',
              transition: '0.2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏋️</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Soy entrenador</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              Creá y administrá tu gym, tus alumnos y tu contenido.
            </p>
          </div>

          <div
            onClick={() => setRol('cliente')}
            style={{
              padding: '25px 20px',
              borderRadius: '14px',
              border: rol === 'cliente' ? '2px solid var(--accent)' : '2px solid #2a2a32',
              background: rol === 'cliente' ? 'rgba(255, 90, 31, 0.1)' : 'var(--card)',
              cursor: 'pointer',
              transition: '0.2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🧍</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Soy cliente</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              Accedé a tus rutinas, ejercicios y videos personalizados.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="service-card" style={{ padding: '30px' }}>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p style={{ color: '#e64a10', fontSize: '0.9rem' }}>{error}</p>
            )}
            {mensaje && (
              <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>{mensaje}</p>
            )}

            <button type="submit" className="btn" disabled={loading || !rol}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>
              Iniciá sesión
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}

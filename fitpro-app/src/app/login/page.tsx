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

            // Ver el rol del usuario
    const { data: { user } } = await supabase.auth.getUser()
    const rol = user?.user_metadata?.rol

    if (rol === 'cliente') {
      router.push('/panel')
    } else {
      // Por defecto, entrenador
      router.push('/panel/mi-gym')
    }
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo" style={{ fontSize: '2rem' }}>
            FIT<span>PRO</span>
          </div>
          <h1 className="section-title" style={{ marginTop: '20px', fontSize: '1.8rem' }}>
            Iniciar sesión
          </h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Ingresá con tu email y contraseña
          </p>
        </div>

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
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p style={{ color: '#e64a10', fontSize: '0.9rem' }}>{error}</p>
            )}

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
            ¿No tenés cuenta?{' '}
            <Link href="/registro" style={{ color: 'var(--accent)', fontWeight: '600' }}>
              Registrate
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

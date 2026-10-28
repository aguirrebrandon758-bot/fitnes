'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RecuperarPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMensaje('')

    // 👇 FORZAMOS LA URL PRINCIPAL 👇
    // Si estás en producción, usa siempre la URL maestra. Si estás en local, usa localhost.
    const isProduction = process.env.NODE_ENV === 'production'
    const redirectUrl = isProduction 
      ? 'https://fitnes-82rs.vercel.app/restablecer' 
      : 'http://localhost:3000/restablecer'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      setError(error.message)
    } else {
      setMensaje('¡Listo! Revisá tu correo. Te enviamos un link para restablecer tu contraseña.')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0e0e10', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(23, 23, 27, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href="/" style={{ fontSize: '2rem', display: 'block', color: '#fff', textDecoration: 'none', fontWeight: 900, marginBottom: '20px' }}>
            FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Recuperar contraseña</h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Ingresá tu correo y te enviaremos un link para crear una nueva.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Correo Electrónico</label>
            <input 
              type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required 
              style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} 
            />
          </div>

          {error && <div style={{ padding: '12px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>{error}</div>}
          {mensaje && <div style={{ padding: '12px', background: 'rgba(34,197,94,.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#86efac', fontSize: '0.9rem' }}>{mensaje}</div>}

          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            {loading ? 'Enviando...' : 'Enviar link de recuperación'}
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', color: '#a1a1aa' }}>
          <Link href="/login" style={{ color: '#ff5a1f', fontWeight: 'bold', textDecoration: 'none' }}>← Volver al login</Link>
        </p>
      </div>
    </div>
  )
}

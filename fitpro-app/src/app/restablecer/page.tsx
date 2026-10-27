'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RestablecerPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [verificando, setVerificando] = useState(true)

  // Verificamos que el usuario haya llegado desde el link del correo
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('El link es inválido o expiró. Por favor, volvé a pedir uno nuevo.')
      }
      setVerificando(false)
    }
    checkSession()
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMensaje('¡Contraseña actualizada con éxito! Redirigiendo...')
      setTimeout(() => {
        router.push('/panel')
        router.refresh()
      }, 2000)
    }
  }

  if (verificando) {
    return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0e0e10', color: '#fff' }}>Verificando link...</div>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#0e0e10', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(23, 23, 27, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Link href="/" style={{ fontSize: '2rem', display: 'block', color: '#fff', textDecoration: 'none', fontWeight: 900, marginBottom: '20px' }}>
            FIT<span style={{ color: '#ff5a1f' }}>PRO</span>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>Nueva contraseña</h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Ingresá tu nueva clave para recuperar el acceso.</p>
        </div>

        {error && !password ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '12px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5', marginBottom: '20px' }}>{error}</div>
            <Link href="/recuperar" className="btn" style={{ display: 'inline-block', padding: '12px 24px' }}>Pedir nuevo link</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Nueva Contraseña</label>
              <input 
                type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '8px', display: 'block' }}>Confirmar Contraseña</label>
              <input 
                type="password" placeholder="Repetí tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }} 
              />
            </div>

            {error && <div style={{ padding: '12px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>{error}</div>}
            {mensaje && <div style={{ padding: '12px', background: 'rgba(34,197,94,.15)', border: '1px solid #22c55e', borderRadius: '8px', color: '#86efac', fontSize: '0.9rem' }}>{mensaje}</div>}

            <button type="submit" className="btn" disabled={loading || mensaje !== ''} style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

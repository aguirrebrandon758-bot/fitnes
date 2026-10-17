'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UnirsePage() {
  const router = useRouter()
  const supabase = createClient()

  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Buscar el gym por código
    const { data: gym, error: gymError } = await supabase
      .from('gyms')
      .select('id, nombre, sufijo')
      .eq('codigo_invitacion', codigo.trim().toUpperCase())
      .eq('activo', true)
      .maybeSingle()

    if (gymError || !gym) {
      setError('Código inválido o gym no encontrado.')
      setCargando(false)
      return
    }

    // Verificar si ya está unido
    const { data: existente } = await supabase
      .from('gym_clientes')
      .select('id')
      .eq('gym_id', gym.id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existente) {
      setError('Ya estás unido a este gym.')
      setCargando(false)
      return
    }

    // Crear la relación
    const { error: insertError } = await supabase
      .from('gym_clientes')
      .insert({
        gym_id: gym.id,
        user_id: user.id,
        activo: true,
      })

    if (insertError) {
      setError('Error al unirse: ' + insertError.message)
      setCargando(false)
      return
    }

    // Éxito → ir al panel
    router.push('/panel')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo" style={{ fontSize: '2rem' }}>
            FIT<span>PRO</span>
          </div>
          <h1 className="section-title" style={{ marginTop: '20px', fontSize: '1.8rem' }}>
            Unite a un gym
          </h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Ingresá el código que te dio tu entrenador
          </p>
        </div>

        <div className="service-card" style={{ padding: '30px' }}>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="codigo">Código de invitación</label>
              <input
                type="text"
                id="codigo"
                placeholder="Ej: FITZONE2025"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#e64a10', fontSize: '0.9rem' }}>{error}</p>
            )}

            <button type="submit" className="btn" disabled={cargando}>
              {cargando ? 'Uniéndome...' : '🔑 Unirme al gym'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/panel" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            ← Volver al panel
          </Link>
        </p>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NuevaRutinaPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gymId, setGymId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [nombre, setNombre] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [duracionSemanas, setDuracionSemanas] = useState('')
  const [nivel, setNivel] = useState('Principiante')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: gym } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle()

      if (!gym) {
        setError('No tenés un gym asignado.')
        setCargando(false)
        return
      }

      setGymId(gym.id)
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!gymId || !nombre.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    setGuardando(true)

    const { data, error: insertError } = await supabase
      .from('rutinas')
      .insert({
        gym_id: gymId,
        nombre: nombre.trim(),
        objetivo: objetivo.trim() || null,
        descripcion: descripcion.trim() || null,
        duracion_semanas: duracionSemanas ? Number(duracionSemanas) : null,
        nivel: nivel,
        activo: true,
      })
      .select()
      .single()

    if (insertError) {
      setError('Error: ' + insertError.message)
      setGuardando(false)
      return
    }

    // Si se creó bien, ir directo a editarla para asignar ejercicios
    router.push(`/panel/rutinas/editar/${data.id}`)
    router.refresh()
  }

  if (cargando) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container">
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>
              FIT<span>PRO</span>
            </Link>
            <Link href="/panel/rutinas" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
              ← Volver a rutinas
            </Link>
          </div>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Nueva rutina</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Primero creá los datos básicos. Después vas a poder asignarle ejercicios.
          </p>
        </div>

        <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label>Nombre de la rutina *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Full Body Principiante"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label>Objetivo</label>
                <input
                  type="text"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ej: Hipertrofia, Fuerza..."
                />
              </div>
              <div>
                <label>Nivel *</label>
                <select value={nivel} onChange={(e) => setNivel(e.target.value)} required>
                  <option>Principiante</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>
            </div>

            <div>
              <label>Duración (semanas)</label>
              <input
                type="number"
                value={duracionSemanas}
                onChange={(e) => setDuracionSemanas(e.target.value)}
                placeholder="Ej: 8"
                min="1"
              />
            </div>

            <div>
              <label>Descripción</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción de la rutina..."
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #2a2a32',
                  background: 'var(--card)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  width: '100%',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ padding: '14px', borderRadius: '10px', marginTop: '20px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
            <button type="submit" className="btn" disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar y continuar'}
            </button>
            <Link href="/panel/rutinas" className="btn btn-outline">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

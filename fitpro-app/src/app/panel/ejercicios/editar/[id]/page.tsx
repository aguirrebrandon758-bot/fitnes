'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditarEjercicioPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const id = params.id as string

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [grupoMuscular, setGrupoMuscular] = useState('')
  const [dificultad, setDificultad] = useState('Principiante')
  const [equipamiento, setEquipamiento] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Buscar el gym del entrenador
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

      // Traer el ejercicio y verificar que sea de su gym
      const { data: ej, error: err } = await supabase
        .from('ejercicios')
        .select('*')
        .eq('id', id)
        .eq('gym_id', gym.id)
        .maybeSingle()

      if (err || !ej) {
        setError('Ejercicio no encontrado o no te pertenece.')
        setCargando(false)
        return
      }

      setNombre(ej.nombre || '')
      setDescripcion(ej.descripcion || '')
      setGrupoMuscular(ej.grupo_muscular || '')
      setDificultad(ej.dificultad || 'Principiante')
      setEquipamiento(ej.equipamiento || '')
      setVideoUrl(ej.video_url || '')
      setCargando(false)
    }
    cargar()
  }, [id, router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.')
      return
    }

    setGuardando(true)

    const { error: updateError } = await supabase
      .from('ejercicios')
      .update({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        grupo_muscular: grupoMuscular.trim() || null,
        dificultad: dificultad,
        equipamiento: equipamiento.trim() || null,
        video_url: videoUrl.trim() || null,
      })
      .eq('id', id)

    if (updateError) {
      setError('Error al guardar: ' + updateError.message)
      setGuardando(false)
      return
    }

    router.push('/panel/ejercicios')
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
            <Link href="/panel/ejercicios" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
              ← Volver a ejercicios
            </Link>
          </div>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Editar ejercicio</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Modificá los datos del ejercicio.
          </p>
        </div>

        {error && !nombre ? (
          <div className="service-card" style={{ padding: '30px', borderColor: '#e64a10' }}>
            <p style={{ color: '#fca5a5' }}>{error}</p>
            <Link href="/panel/ejercicios" className="btn btn-sm" style={{ marginTop: '20px' }}>
              Volver
            </Link>
          </div>
        ) : (
          <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
            <div style={{ display: 'grid', gap: '18px' }}>
              <div>
                <label>Nombre del ejercicio *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Descripción</label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label>Grupo muscular</label>
                  <input
                    type="text"
                    value={grupoMuscular}
                    onChange={(e) => setGrupoMuscular(e.target.value)}
                  />
                </div>

                <div>
                  <label>Dificultad *</label>
                  <select value={dificultad} onChange={(e) => setDificultad(e.target.value)} required>
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Equipamiento</label>
                <input
                  type="text"
                  value={equipamiento}
                  onChange={(e) => setEquipamiento(e.target.value)}
                />
              </div>

              <div>
                <label>URL del video (YouTube)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                marginTop: '20px',
                background: 'rgba(230,74,16,.15)',
                border: '1px solid #e64a10',
                color: '#fca5a5',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
              <button type="submit" className="btn" disabled={guardando}>
                {guardando ? 'Guardando...' : '💾 Guardar cambios'}
              </button>
              <Link href="/panel/ejercicios" className="btn btn-outline">
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

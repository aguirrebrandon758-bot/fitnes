'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

type Ejercicio = {
  id: string
  nombre: string
  grupo_muscular: string | null
}

type RutinaEjercicio = {
  id: string
  dia: number | null
  series: number | null
  repeticiones: string | null
  descanso_seg: number | null
  notas: string | null
  ejercicio_id: string
  ejercicios: { nombre: string; grupo_muscular: string | null } | null
}

function EditarRutinaForm() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const id = params.id as string

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [gymId, setGymId] = useState<string | null>(null)

  const [nombre, setNombre] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [duracionSemanas, setDuracionSemanas] = useState('')
  const [nivel, setNivel] = useState('Principiante')

  const [ejerciciosGym, setEjerciciosGym] = useState<Ejercicio[]>([])
  const [rutinaEjercicios, setRutinaEjercicios] = useState<RutinaEjercicio[]>([])

  // Estados del formulario de agregar
  const [nuevoEjercicioId, setNuevoEjercicioId] = useState('')
  const [nuevoDia, setNuevoDia] = useState('1')
  const [nuevasSeries, setNuevasSeries] = useState('3')
  const [nuevoDescanso, setNuevoDescanso] = useState('60')
  const [nuevasNotas, setNuevasNotas] = useState('')
  const [agregando, setAgregando] = useState(false)

  // 🔥 NUEVOS ESTADOS PARA EL TIPO DE MEDIDA
  const [tipoMedida, setTipoMedida] = useState<'reps' | 'tiempo'>('reps')
  const [nuevasReps, setNuevasReps] = useState('10') // Si es reps
  const [tiempoValor, setTiempoValor] = useState('45') // Si es tiempo
  const [tiempoUnidad, setTiempoUnidad] = useState('seg') // 'seg' o 'min'

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

      const { data: r, error: err } = await supabase
        .from('rutinas')
        .select('*')
        .eq('id', id)
        .eq('gym_id', gym.id)
        .maybeSingle()

      if (err || !r) {
        setError('Rutina no encontrada.')
        setCargando(false)
        return
      }

      setNombre(r.nombre || '')
      setObjetivo(r.objetivo || '')
      setDescripcion(r.descripcion || '')
      setDuracionSemanas(r.duracion_semanas != null ? String(r.duracion_semanas) : '')
      setNivel(r.nivel || 'Principiante')

      const { data: ejs } = await supabase
        .from('ejercicios')
        .select('id, nombre, grupo_muscular')
        .eq('gym_id', gym.id)
        .eq('activo', true)
        .order('nombre')

      setEjerciciosGym(ejs ?? [])

      await cargarEjerciciosRutina()
      setCargando(false)
    }
    cargar()
  }, [id, router, supabase])

  async function cargarEjerciciosRutina() {
    const { data } = await supabase
      .from('rutina_ejercicios')
      .select(`
        id, dia, series, repeticiones, descanso_seg, notas, ejercicio_id,
        ejercicios (nombre, grupo_muscular)
      `)
      .eq('rutina_id', id)
      .order('dia')
      .order('orden')

    setRutinaEjercicios((data as unknown as RutinaEjercicio[]) ?? [])
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)

    const { error: upError } = await supabase
      .from('rutinas')
      .update({
        nombre: nombre.trim(),
        objetivo: objetivo.trim() || null,
        descripcion: descripcion.trim() || null,
        duracion_semanas: duracionSemanas ? Number(duracionSemanas) : null,
        nivel: nivel,
      })
      .eq('id', id)

    if (upError) {
      alert('Error: ' + upError.message)
    } else {
      router.push('/panel/rutinas')
      router.refresh()
    }
    setGuardando(false)
  }

  async function agregarEjercicio(e: React.FormEvent) {
    e.preventDefault()
    if (!nuevoEjercicioId) {
      alert('Elegí un ejercicio.')
      return
    }

    setAgregando(true)

    // Lógica para guardar reps o tiempo
    let repsFinal = ''
    if (tipoMedida === 'reps') {
      repsFinal = nuevasReps.trim()
    } else {
      repsFinal = `${tiempoValor} ${tiempoUnidad}`
    }

    const { error } = await supabase
      .from('rutina_ejercicios')
      .insert({
        rutina_id: id,
        ejercicio_id: nuevoEjercicioId,
        dia: Number(nuevoDia),
        series: Number(nuevasSeries),
        repeticiones: repsFinal,
        descanso_seg: Number(nuevoDescanso),
        notas: nuevasNotas.trim() || null,
      })

    if (error) {
      alert('Error al agregar: ' + error.message)
    } else {
      setNuevoEjercicioId('')
      setNuevasNotas('')
      setTipoMedida('reps') // Resetear al tipo reps
      await cargarEjerciciosRutina()
    }
    setAgregando(false)
  }

  async function eliminarEjercicio(idRelacion: string) {
    if (!confirm('¿Quitar este ejercicio de la rutina?')) return

    const { error } = await supabase
      .from('rutina_ejercicios')
      .delete()
      .eq('id', idRelacion)

    if (error) {
      alert('Error: ' + error.message)
    } else {
      await cargarEjerciciosRutina()
    }
  }

  const porDia: Record<number, RutinaEjercicio[]> = {}
  rutinaEjercicios.forEach((ej) => {
    const d = ej.dia || 1
    if (!porDia[d]) porDia[d] = []
    porDia[d].push(ej)
  })

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
      <div className="container" style={{ maxWidth: '900px' }}>
        
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
          <h1 className="section-title">Editar rutina</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Modificá los datos o agregá ejercicios a los días.
          </p>
        </div>

        {/* SECCIÓN 1: DATOS BÁSICOS */}
        <form onSubmit={guardar} className="service-card" style={{ padding: '35px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--accent)' }}>Datos básicos</h2>
          
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <label>Nombre de la rutina *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label>Objetivo</label>
                <input type="text" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
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
              <input type="number" value={duracionSemanas} onChange={(e) => setDuracionSemanas(e.target.value)} min="1" />
            </div>

            <div>
              <label>Descripción</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #2a2a32', background: 'var(--card)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '1rem', width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="btn" disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar datos básicos'}
            </button>
          </div>
        </form>

        {/* SECCIÓN 2: EJERCICIOS ASIGNADOS */}
        <div className="service-card" style={{ padding: '35px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--accent)' }}>Ejercicios de la rutina</h2>

          {Object.keys(porDia).length === 0 ? (
            <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>Todavía no agregaste ejercicios.</p>
          ) : (
            <div style={{ marginBottom: '40px' }}>
              {Object.keys(porDia).sort().map((diaNum) => (
                <div key={diaNum} style={{ marginBottom: '25px' }}>
                  <h3 style={{ color: 'var(--text)', fontSize: '1rem', marginBottom: '12px', borderBottom: '1px solid #2a2a32', paddingBottom: '8px' }}>
                    Día {diaNum}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {porDia[Number(diaNum)].map((ej) => (
                      <div key={ej.id} style={{ background: 'var(--bg-2)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{ej.ejercicios?.nombre}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{ej.ejercicios?.grupo_muscular} {ej.notas && `· ${ej.notas}`}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div style={{ fontSize: '0.85rem' }}>
                            <strong style={{ color: 'var(--accent-2)' }}>{ej.series}</strong> series × <strong style={{ color: 'var(--accent-2)' }}>{ej.repeticiones}</strong>
                            {ej.descanso_seg && <span style={{ color: 'var(--muted)' }}> ({ej.descanso_seg}s desc)</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => eliminarEjercicio(ej.id)}
                            style={{ background: 'transparent', border: 'none', color: '#e64a10', cursor: 'pointer', fontSize: '1rem' }}
                            title="Quitar ejercicio"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FORMULARIO PARA AGREGAR */}
          <div style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '10px', border: '1px solid #2a2a32' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>➕ Agregar un ejercicio</h3>
            <form onSubmit={agregarEjercicio}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '15px' }}>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.8rem' }}>Ejercicio</label>
                  <select value={nuevoEjercicioId} onChange={(e) => setNuevoEjercicioId(e.target.value)} required>
                    <option value="">Elegí un ejercicio...</option>
                    {ejerciciosGym.map((ej) => (
                      <option key={ej.id} value={ej.id}>{ej.nombre} ({ej.grupo_muscular})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Día</label>
                  <input type="number" value={nuevoDia} onChange={(e) => setNuevoDia(e.target.value)} min="1" required />
                </div>
                
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Series</label>
                  <input type="number" value={nuevasSeries} onChange={(e) => setNuevasSeries(e.target.value)} min="1" required />
                </div>

                {/* 🔥 SELECTOR DE TIPO DE MEDIDA */}
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Tipo de medida</label>
                  <select value={tipoMedida} onChange={(e) => setTipoMedida(e.target.value as 'reps' | 'tiempo')}>
                    <option value="reps">Repeticiones</option>
                    <option value="tiempo">Tiempo</option>
                  </select>
                </div>

                {/* 🔥 INPUTS DINÁMICOS */}
                {tipoMedida === 'reps' ? (
                  <div>
                    <label style={{ fontSize: '0.8rem' }}>Reps</label>
                    <input type="text" value={nuevasReps} onChange={(e) => setNuevasReps(e.target.value)} placeholder="Ej: 10-12" required />
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem' }}>Tiempo</label>
                      <input type="number" value={tiempoValor} onChange={(e) => setTiempoValor(e.target.value)} min="1" required />
                    </div>
                    <div style={{ width: '80px' }}>
                      <label style={{ fontSize: '0.8rem' }}>Unidad</label>
                      <select value={tiempoUnidad} onChange={(e) => setTiempoUnidad(e.target.value)}>
                        <option value="seg">seg</option>
                        <option value="min">min</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem' }}>Descanso (seg)</label>
                  <input type="number" value={nuevoDescanso} onChange={(e) => setNuevoDescanso(e.target.value)} min="0" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.8rem' }}>Notas (opcional)</label>
                  <input type="text" value={nuevasNotas} onChange={(e) => setNuevasNotas(e.target.value)} placeholder="Ej: Al fallo, tempo lento..." />
                </div>
              </div>
              
              <button type="submit" className="btn btn-sm" disabled={agregando}>
                {agregando ? 'Agregando...' : 'Agregar ejercicio'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function EditarRutinaPage() {
  return (
    <Suspense fallback={
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container">
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p>
        </div>
      </div>
    }>
      <EditarRutinaForm />
    </Suspense>
  )
}

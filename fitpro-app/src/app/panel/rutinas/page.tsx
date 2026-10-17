'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Rutina = {
  id: string
  nombre: string
  objetivo: string | null
  descripcion: string | null
  duracion_semanas: number | null
  nivel: string | null
}

type RutinaEjercicio = {
  id: string
  rutina_id: string
  dia: number | null
  series: number | null
  repeticiones: string | null
  descanso_seg: number | null
  orden: number | null
  notas: string | null
  ejercicios: {
    nombre: string
    grupo_muscular: string | null
  } | null
}

export default function RutinasPage() {
  const router = useRouter()
  const supabase = createClient()

  const [rutinas, setRutinas] = useState<Rutina[]>([])
  const [detalles, setDetalles] = useState<Record<string, RutinaEjercicio[]>>({})
  const [cargando, setCargando] = useState(true)
  const [abierta, setAbierta] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Traer rutinas
      const { data: rutinasData } = await supabase
        .from('rutinas')
        .select('*')
        .order('nombre')

      // Traer TODOS los rutina_ejercicios con el nombre del ejercicio
      const { data: relData } = await supabase
        .from('rutina_ejercicios')
        .select(`
          id,
          rutina_id,
          dia,
          series,
          repeticiones,
          descanso_seg,
          orden,
          notas,
          ejercicios (nombre, grupo_muscular)
        `)
        .order('dia')
        .order('orden')

      // Agrupar por rutina_id
      const agrupado: Record<string, RutinaEjercicio[]> = {}
      ;(relData as unknown as RutinaEjercicio[] ?? []).forEach((rel) => {
        if (!agrupado[rel.rutina_id]) agrupado[rel.rutina_id] = []
        agrupado[rel.rutina_id].push(rel)
      })

      setRutinas(rutinasData ?? [])
      setDetalles(agrupado)
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  // Función para eliminar rutina
  async function eliminar(id: string, nombre: string) {
    const confirmado = confirm(`¿Eliminar la rutina "${nombre}"? Esta acción también borrará los ejercicios asignados.`)
    if (!confirmado) return

    const { error } = await supabase
      .from('rutinas')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    setRutinas((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        {/* Header */}
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>
              FIT<span>PRO</span>
            </Link>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/panel/rutinas/nuevo" className="btn btn-sm">
                ➕ Nueva rutina
              </Link>
              <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                ← Volver al panel
              </Link>
            </div>
          </div>
        </header>

        {/* Título */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Rutinas</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Tenés <strong style={{ color: 'var(--accent)' }}>{rutinas.length}</strong> rutinas cargadas.
            Hacé clic para ver los ejercicios de cada día.
          </p>
        </div>

        {/* Estado de carga */}
        {cargando ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>
            Cargando rutinas...
          </p>
        ) : rutinas.length === 0 ? (
          <div className="service-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              Todavía no cargaste ninguna rutina.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {rutinas.map((r) => {
              const lista = detalles[r.id] ?? []
              const estaAbierta = abierta === r.id

              // Agrupar por día
              const porDia: Record<number, RutinaEjercicio[]> = {}
              lista.forEach((ej) => {
                const d = ej.dia ?? 1
                if (!porDia[d]) porDia[d] = []
                porDia[d].push(ej)
              })

              return (
                <div key={r.id} className="rutina-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* Parte clickeable (para expandir) */}
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => setAbierta(estaAbierta ? null : r.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <span className="badge-nivel">{r.nivel}</span>
                        <h3 style={{ fontSize: '1.4rem', marginTop: '8px', marginBottom: '8px' }}>
                          {r.nombre}
                        </h3>
                        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
                          {r.descripcion || 'Sin descripción'}
                        </p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--muted)' }}>
                          <span>🎯 {r.objetivo || '—'}</span>
                          <span>📅 {r.duracion_semanas || '—'} semanas</span>
                          <span>💪 {lista.length} ejercicios</span>
                        </div>
                      </div>
                      <div style={{ color: 'var(--accent)', fontSize: '1.5rem', transition: 'transform 0.2s' }}>
                        {estaAbierta ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {/* Detalle expandido */}
                  {estaAbierta && (
                    <div style={{ borderTop: '1px solid #2a2a32', paddingTop: '25px' }}>
                      {Object.keys(porDia).length === 0 ? (
                        <p style={{ color: 'var(--muted)' }}>Esta rutina todavía no tiene ejercicios asignados.</p>
                      ) : (
                        Object.keys(porDia).sort().map((diaNum) => (
                          <div key={diaNum} style={{ marginBottom: '25px' }}>
                            <h4 style={{
                              color: 'var(--accent)',
                              fontSize: '1rem',
                              letterSpacing: '1px',
                              marginBottom: '12px',
                              textTransform: 'uppercase'
                            }}>
                              Día {diaNum}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {porDia[Number(diaNum)].map((ej) => (
                                <div
                                  key={ej.id}
                                  style={{
                                    background: 'var(--bg-2)',
                                    padding: '14px 18px',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '15px',
                                    flexWrap: 'wrap'
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                      {ej.ejercicios?.nombre || 'Ejercicio'}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                                      {ej.ejercicios?.grupo_muscular}
                                      {ej.notas && ` · ${ej.notas}`}
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text)' }}>
                                    <span><strong style={{ color: 'var(--accent-2)' }}>{ej.series}</strong> series</span>
                                    <span><strong style={{ color: 'var(--accent-2)' }}>{ej.repeticiones}</strong> reps</span>
                                    {ej.descanso_seg && (
                                      <span style={{ color: 'var(--muted)' }}>
                                        {ej.descanso_seg}s desc.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #2a2a32', paddingTop: '15px', marginTop: 'auto' }}>
                    <Link
                      href={`/panel/rutinas/editar/${r.id}`}
                      className="btn btn-sm"
                      style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '8px' }}
                    >
                      ✏️ Editar y Asignar Ejercicios
                    </Link>
                    <button
                      onClick={() => eliminar(r.id, r.nombre)}
                      className="btn btn-sm"
                      style={{
                        fontSize: '0.8rem',
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid #e64a10',
                        color: '#e64a10',
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

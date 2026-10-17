'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Alimento = {
  id: string
  nombre: string
  categoria: string | null
  porcion: string | null
  kcal: number | null
  proteinas: number | null
  carbohidratos: number | null
  grasas: number | null
}

export default function AlimentosPage() {
  const router = useRouter()
  const supabase = createClient()

  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('alimentos')
        .select('*')
        .order('nombre')

      setAlimentos(data ?? [])
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function eliminar(id: string, nombre: string) {
    const confirmado = confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)
    if (!confirmado) return

    const { error } = await supabase
      .from('alimentos')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
      return
    }

    setAlimentos((prev) => prev.filter((a) => a.id !== id))
  }

  // Categorías únicas
  const categorias = [...new Set(alimentos.map((a) => a.categoria).filter(Boolean))].sort() as string[]

  // Filtrado
  const filtrados = alimentos.filter((a) => {
    const coincideCategoria = !categoria || a.categoria === categoria
    const coincideBusqueda = !busqueda || (a.nombre || '').toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

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
              <Link href="/panel/alimentos/nuevo" className="btn btn-sm">
                ➕ Nuevo alimento
              </Link>
              <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
                ← Volver al panel
              </Link>
            </div>
          </div>
        </header>

        {/* Título */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Guía de alimentos</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            <strong style={{ color: 'var(--accent)' }}>{alimentos.length}</strong> alimentos con información nutricional por porción.
          </p>
        </div>

        {/* Filtros */}
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar alimento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Estado de carga */}
        {cargando ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>
            Cargando alimentos...
          </p>
        ) : filtrados.length === 0 ? (
          <div className="service-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
              No hay alimentos que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla-alimentos">
              <thead>
                <tr>
                  <th>Alimento</th>
                  <th>Categoría</th>
                  <th>Porción</th>
                  <th>Kcal</th>
                  <th>Prot.</th>
                  <th>Carb.</th>
                  <th>Grasas</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td>
                    <td style={{ color: 'var(--muted)' }}>{a.categoria}</td>
                    <td>{a.porcion}</td>
                    <td><strong style={{ color: 'var(--accent-2)' }}>{a.kcal}</strong></td>
                    <td>{a.proteinas} g</td>
                    <td>{a.carbohidratos} g</td>
                    <td>{a.grasas} g</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link
                          href={`/panel/alimentos/editar/${a.id}`}
                          className="btn btn-sm"
                          style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => eliminar(a.id, a.nombre)}
                          className="btn btn-sm"
                          style={{
                            fontSize: '0.75rem',
                            padding: '6px 10px',
                            background: 'transparent',
                            border: '1px solid #e64a10',
                            color: '#e64a10',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

function EditarAlimentoForm() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const id = params.id as string

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('')
  const [porcion, setPorcion] = useState('')
  const [kcal, setKcal] = useState('')
  const [proteinas, setProteinas] = useState('')
  const [carbohidratos, setCarbohidratos] = useState('')
  const [grasas, setGrasas] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (!gym) { setError('No tenés un gym asignado.'); setCargando(false); return }

      const { data: a, error: err } = await supabase.from('alimentos').select('*').eq('id', id).eq('gym_id', gym.id).maybeSingle()
      if (err || !a) { setError('Alimento no encontrado o no te pertenece.'); setCargando(false); return }

      setNombre(a.nombre || '')
      setCategoria(a.categoria || '')
      setPorcion(a.porcion || '')
      setKcal(a.kcal != null ? String(a.kcal) : '')
      setProteinas(a.proteinas != null ? String(a.proteinas) : '')
      setCarbohidratos(a.carbohidratos != null ? String(a.carbohidratos) : '')
      setGrasas(a.grasas != null ? String(a.grasas) : '')
      setCargando(false)
    }
    cargar()
  }, [id, router, supabase])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return }

    setGuardando(true)
    const { error: upError } = await supabase.from('alimentos').update({
        nombre: nombre.trim(), categoria: categoria.trim() || null, porcion: porcion.trim() || null,
        kcal: kcal ? Number(kcal) : null, proteinas: proteinas ? Number(proteinas) : null,
        carbohidratos: carbohidratos ? Number(carbohidratos) : null, grasas: grasas ? Number(grasas) : null,
      }).eq('id', id)

    if (upError) { setError('Error: ' + upError.message); setGuardando(false); return }
    router.push('/panel/alimentos'); router.refresh()
  }

  if (cargando) return <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}><div className="container"><p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p></div></div>

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
            <Link href="/panel/alimentos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver</Link>
          </div>
        </header>
        <div style={{ marginBottom: '40px' }}><h1 className="section-title">Editar alimento</h1></div>
        {error && !nombre ? (
          <div className="service-card" style={{ padding: '30px', borderColor: '#e64a10' }}><p style={{ color: '#fca5a5' }}>{error}</p><Link href="/panel/alimentos" className="btn btn-sm" style={{ marginTop: '20px' }}>Volver</Link></div>
        ) : (
          <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
            <div style={{ display: 'grid', gap: '18px' }}>
              <div><label>Nombre *</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div><label>Categoría</label><input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} /></div>
                <div><label>Porción</label><input type="text" value={porcion} onChange={(e) => setPorcion(e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                <div><label>Kcal</label><input type="number" step="0.01" value={kcal} onChange={(e) => setKcal(e.target.value)} /></div>
                <div><label>Proteínas (g)</label><input type="number" step="0.01" value={proteinas} onChange={(e) => setProteinas(e.target.value)} /></div>
                <div><label>Carbohidratos (g)</label><input type="number" step="0.01" value={carbohidratos} onChange={(e) => setCarbohidratos(e.target.value)} /></div>
                <div><label>Grasas (g)</label><input type="number" step="0.01" value={grasas} onChange={(e) => setGrasas(e.target.value)} /></div>
              </div>
            </div>
            {error && <div style={{ padding: '14px', borderRadius: '10px', marginTop: '20px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', color: '#fca5a5' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
              <button type="submit" className="btn" disabled={guardando}>{guardando ? 'Guardando...' : '💾 Guardar cambios'}</button>
              <Link href="/panel/alimentos" className="btn btn-outline">Cancelar</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function EditarAlimentoPage() {
  return (
    <Suspense fallback={<div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}><div className="container"><p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p></div></div>}>
      <EditarAlimentoForm />
    </Suspense>
  )
}

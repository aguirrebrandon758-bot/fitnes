'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DietasPage() {
  const router = useRouter()
  const supabase = createClient()
  const [dietas, setDietas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: gym } = await supabase.from('gyms').select('id').eq('owner_id', user.id).maybeSingle()
      if (gym) {
        const { data } = await supabase.from('dietas').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false })
        setDietas(data || [])
      }
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta dieta? Los clientes que la tengan asignada quedarán sin plan.')) return
    await supabase.from('dietas').delete().eq('id', id)
    setDietas(prev => prev.filter(d => d.id !== id))
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Cargando...</div>

  return (
    <div className="page-container">
      
      {/* HEADER RESPONSIVO MEJORADO */}
      <header className="dietas-header">
        <h1 className="section-title" style={{ margin: 0 }}>Alimentación</h1>

        <div className="dietas-actions">
          <Link href="/panel" className="btn-volver">
            ← Volver
          </Link>
          <Link href="/panel/dietas/nuevo" className="btn-nueva glow-btn">
            + Nueva Dieta
          </Link>
        </div>
      </header>

      <div style={{ marginBottom: '30px' }}>
        <p className="section-sub">Creá guías para perder peso, ganar masa o déficit.</p>
      </div>

      {/* GRILLA DE DIETAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {dietas.length === 0 ? (
          <div className="service-card" style={{ textAlign: 'center', padding: '40px 20px', gridColumn: '1 / -1' }}>
            <p style={{ color: 'var(--muted)' }}>Todavía no creaste ninguna dieta.</p>
          </div>
        ) : (
          dietas.map(d => (
            <div key={d.id} className="dieta-card">
              <div>
                <span className="tag" style={{ background: 'var(--accent)', color: '#fff' }}>{d.tipo}</span>
                <h3 style={{ marginTop: '15px', fontSize: '1.2rem', marginBottom: '10px' }}>{d.nombre}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{d.descripcion || 'Sin instrucciones detalladas.'}</p>
              </div>
              
              <button onClick={() => eliminar(d.id)} className="delete-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      {/* ESTILOS CSS */}
      <style>{`
        /* --- HEADER DESKTOP --- */
        .dietas-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end; /* Alinea los botones con la base del título */
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dietas-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        /* Botones */
        .btn-volver {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #a1a1aa;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .btn-volver:hover { background: rgba(255,255,255,0.05); color: #fff; }

        .btn-nueva {
          background: var(--accent);
          color: #fff;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .glow-btn:hover, .glow-btn:active {
          box-shadow: 0 0 20px var(--accent);
          transform: translateY(-2px);
        }

        /* --- TARJETAS --- */
        .dieta-card {
          background: rgba(20, 20, 24, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .dieta-card:hover { border-color: rgba(255,255,255,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

        /* --- BOTÓN ELIMINAR --- */
        .delete-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px; border-radius: 12px;
          background: rgba(230,74,16,0.05); border: 1px solid rgba(230,74,16,0.3);
          color: #e64a10; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
        }
        .delete-btn:hover, .delete-btn:active { background: #e64a10; color: #fff; box-shadow: 0 0 15px rgba(230,74,16,0.5); }

        /* --- VISTA CELULAR --- */
        @media (max-width: 900px) {
          .dietas-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          .dietas-actions {
            width: 100%;
            justify-content: space-between; /* Los pone uno a cada lado */
          }
          .btn-volver, .btn-nueva {
            flex: 1; /* Hace que ocupen 50% y 50% */
            text-align: center;
            padding: 12px 10px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  )
}

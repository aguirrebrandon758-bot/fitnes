'use client'

import { useState } from 'react'

export default function StatsCards({ totalEj, totalRu, totalDi, totalVi }: { totalEj: number, totalRu: number, totalDi: number, totalVi: number }) {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  const stats = [
    { 
      label: 'Ejercicios', value: totalEj, color: '#3b82f6', 
      desc: 'Biblioteca y técnica',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12"></path><path d="M6 12h12"></path><path d="M6 16h12"></path><path d="M3 4v16"></path><path d="M21 4v16"></path></svg>
    },
    { 
      label: 'Rutinas', value: totalRu, color: '#eab308', 
      desc: 'Planes de entrenamiento',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
    { 
      label: 'Dietas', value: totalDi, color: '#22c55e', 
      desc: 'Guía nutricional',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path><path d="M10 2c1 .5 2 2 2 5"></path></svg>
    },
    { 
      label: 'Videos', value: totalVi, color: '#a855f7', 
      desc: 'Técnicas en video',
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
    },
  ]

  return (
    <div className="stats-grid">
      {stats.map((s, index) => {
        const isActive = activeCard === index
        
        return (
          <div 
            key={s.label} 
            className={`stat-card ${isActive ? 'active' : ''}`} 
            onClick={() => setActiveCard(isActive ? null : index)}
            style={{ 
              background: isActive ? `${s.color}15` : 'rgba(20, 20, 24, 0.7)',
              borderColor: isActive ? s.color : 'rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }}></div>
            
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                {s.icon}
              </div>
              <div style={{ color: s.color, fontSize: '0.7rem', fontWeight: 700, background: `${s.color}20`, padding: '4px 8px', borderRadius: '50px' }}>
                +{s.label}
              </div>
            </div>

            <div className="stat-value">{s.value}</div>
            
            {/* Subtítulo interactivo que aparece al tocar */}
            <div className={`stat-desc ${isActive ? 'show' : ''}`} style={{ color: s.color }}>
              {s.desc}
            </div>
            <div className="stat-label">Total de {s.label}</div>
          </div>
        )
      })}

      <style>{`
        /* GRID PARA COMPUTADORA (4 columnas) */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 25px;
        }

        .stat-card {
          border: 1px solid;
          border-radius: 20px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .stat-icon {
          width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 16px;
          transition: all 0.3s ease;
        }

        .stat-value {
          font-size: 3rem; font-weight: 900; line-height: 1; margin-bottom: 5px;
        }

        .stat-label {
          color: #71717a; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.5px;
        }

        /* Animación del subtítulo */
        .stat-desc {
          font-size: 0.8rem;
          font-weight: 700;
          opacity: 0;
          height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 0;
        }
        .stat-desc.show {
          opacity: 1;
          height: auto;
          margin-bottom: 8px;
          transform: translateY(0);
        }

        .stat-card.active {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .stat-card.active .stat-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 0 15px currentColor;
        }

        /* GRID PARA CELULARES (2 columnas exactas) */
        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important; /* Fuerza 2 columnas */
            gap: 12px;
          }
          .stat-card {
            padding: 15px;
            border-radius: 16px;
          }
          .stat-header {
            margin-bottom: 12px;
          }
          .stat-icon {
            width: 40px; height: 40px; border-radius: 12px;
          }
          .stat-icon svg {
            width: 20px; height: 20px;
          }
          .stat-value {
            font-size: 2rem;
          }
          .stat-label {
            font-size: 0.75rem;
          }
          .stat-desc {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  )
}

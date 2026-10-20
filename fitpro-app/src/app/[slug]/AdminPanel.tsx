'use client'

import Link from 'next/link'

export default function AdminPanel({ gym }: { gym: any }) {
  return (
    <div style={{ 
      background: '#17171b', 
      borderBottom: '1px solid #2a2a32', 
      padding: '15px 20px', 
      position: 'sticky', 
      top: '70px', 
      zIndex: 90,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            MODO ADMINISTRADOR
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Estás viendo tu página pública.</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/panel" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
            🏋️ Ir a mi panel
          </Link>
          <Link href="/panel/galeria" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
            📸 Galería
          </Link>
          <Link href="/admin" className="btn btn-sm" style={{ background: 'rgba(255,90,31,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
            👑 Volver al Admin
          </Link>
        </div>
      </div>
    </div>
  )
}

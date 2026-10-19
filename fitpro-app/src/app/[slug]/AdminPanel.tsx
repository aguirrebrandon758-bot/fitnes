'use client'

import Link from 'next/link'

export default function AdminPanel({ gym }: { gym: any }) {
  return (
    <div style={{ 
      background: '#17171b', 
      borderBottom: '1px solid #2a2a32', 
      padding: '20px', 
      position: 'sticky', 
      top: '70px', 
      zIndex: 90,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: 'var(--accent)', color: '#fff', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            MODO ADMINISTRADOR
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Estás viendo tu propio gimnasio.</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/panel/clientes" className="btn btn-sm">👥 Clientes</Link>
          <Link href={`/panel/mi-gym`} className="btn btn-sm">⚙️ Editar Gym</Link>
          <Link href="/panel/dietas" className="btn btn-sm">🍏 Dietas</Link>
          <Link href="/panel/testimonios" className="btn btn-sm">💬 Testimonios</Link>
          <Link href="/panel" className="btn btn-sm btn-outline">📊 Panel General</Link>
        </div>
      </div>
    </div>
  )
}

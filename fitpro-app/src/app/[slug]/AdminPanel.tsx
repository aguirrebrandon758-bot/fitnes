'use client'

import Link from 'next/link'

export default function AdminPanel({ gym }: { gym: any }) {
  return (
    <div style={{ 
      background: 'rgba(23, 23, 27, 0.8)', // Fondo semitransparente
      backdropFilter: 'blur(16px)',        // Efecto vidrio
      borderBottom: '1px solid rgba(255,255,255,0.05)', 
      padding: '12px 20px', 
      position: 'sticky', 
      top: '72px', 
      zIndex: 90,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: 'var(--accent)', color: '#fff', padding: '6px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            MODO ADMIN
          </span>
          <span style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'none' }} className="admin-text-hide">Estás viendo tu página pública.</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link href="/panel" className="admin-btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '50px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            🏋️ Ir a mi panel
          </Link>
          <Link href="/panel/galeria" className="admin-btn" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '50px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            📸 Galería
          </Link>
          <Link href="/admin" className="admin-btn" style={{ background: 'rgba(255,90,31,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '8px 16px', borderRadius: '50px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            👑 Volver al Admin
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-btn {
          transition: all 0.2s ease;
        }
        .admin-btn:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.1);
        }
        .admin-btn[href="/admin"]:hover {
          background: var(--accent) !important;
          color: #fff !important;
        }
        @media (min-width: 768px) {
          .admin-text-hide { display: inline !important; }
        }
      `}</style>
    </div>
  )
}

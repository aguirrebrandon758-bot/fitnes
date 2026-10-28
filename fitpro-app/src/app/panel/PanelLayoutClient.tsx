'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MusicPlayer from '@/components/MusicPlayer'

export default function PanelLayoutClient({ children, isSuperAdmin, gymSlug, userEmail }: any) {
  // Estado compartido: controla si el menú está abierto o cerrado
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="panel-wrapper" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#09090b', color: '#fff', fontFamily: 'system-ui', overflow: 'hidden' }}>
      
      {/* Le pasamos el estado al menú lateral */}
      <Sidebar 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
        isSuperAdmin={isSuperAdmin} 
        gymSlug={gymSlug} 
        userEmail={userEmail} 
      />

      <main className="main-content custom-scrollbar" style={{ flex: 1, overflowY: 'auto', background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)' }}>
        {children}
      </main>

      {/* Le pasamos el estado al reproductor de música */}
      <MusicPlayer isExpanded={isExpanded} />

    </div>
  )
}

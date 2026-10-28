'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import MusicPlayer from '@/components/MusicPlayer'

export default function PanelLayoutClient({ children, isSuperAdmin, gymSlug, userEmail }: any) {
  // Estado compartido: controla si el menú está abierto o cerrado
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="panel-wrapper" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#050505', color: '#fff', fontFamily: 'system-ui', overflow: 'hidden' }}>
      
      {/* Le pasamos el estado al menú lateral */}
      <Sidebar 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
        isSuperAdmin={isSuperAdmin} 
        gymSlug={gymSlug} 
        userEmail={userEmail} 
      />

      {/* 
        👇 ACÁ ESTÁ EL FONDO DEGRADADO DINÁMICO 👇
        Usa color-mix para mezclar el color del gym (--accent) con el negro (#050505).
        Empieza oscuro arriba y se va iluminando con el color del gym hacia abajo.
      */}
      <main className="main-content custom-scrollbar" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        background: 'linear-gradient(180deg, #050505 0%, color-mix(in srgb, var(--accent) 10%, #050505) 40%, color-mix(in srgb, var(--accent) 25%, #050505) 100%)',
        minHeight: '100vh'
      }}>
        {children}
      </main>

      {/* Le pasamos el estado al reproductor de música */}
      <MusicPlayer isExpanded={isExpanded} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

        .page-container { padding: 50px; max-width: 1200px; margin: 0 auto; }
        
        @media (max-width: 900px) {
          .panel-wrapper { flex-direction: column !important; height: 100vh !important; overflow: hidden !important; }
          .main-content { padding: 20px 15px 180px 15px !important; }
          .page-container { padding: 20px 0; }
          
          /* ACÁ MOVEMOS EL REPRODUCTOR DE MÚSICA ARRIBA DE LA BARRA EN CELULAR */
          .music-player-wrapper { 
            bottom: 100px !important; 
            left: 15px !important; 
            transform: scale(0.85) !important; 
            transform-origin: bottom left !important; 
          }
        }
      `}</style>
    </div>
  )
}

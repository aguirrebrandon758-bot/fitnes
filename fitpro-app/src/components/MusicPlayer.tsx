'use client'

import { useRef, useState } from 'react'

const TRACKS = [
  { title: 'Lose Yourself', artist: 'Eminem', url: '/music/Eminem - Lose Yourself.mp3', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop' },
  { title: 'Godzilla', artist: 'Eminem ft. Juice WRLD', url: '/music/Eminem - Godzilla ft. Juice WRLD (Official Music Video).mp3', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=100&h=100&fit=crop' },
  { title: 'Faint', artist: 'Linkin Park', url: '/music/Faint (Official Music Video) 4K UPGRADE – Linkin Park.mp3', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&h=100&fit=crop' },
  { title: 'Numb', artist: 'Linkin Park', url: '/music/Numb (Official Music Video) 4K UPGRADE – Linkin Park.mp3', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&h=100&fit=crop' },
  { title: "What I've Done", artist: 'Linkin Park', url: '/music/What I ve Done (Official Music Video) 4K Upgrade - Linkin Park.mp3', cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&h=100&fit=crop' },
  { title: 'Master of Puppets', artist: 'Metallica', url: '/music/Metallica_ Master of Puppets (Official Lyric Video) [6xjJ2XIbGRk].mp3', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop' },
  { title: 'Smells Like Teen Spirit', artist: 'Nirvana', url: '/music/Nirvana - Smells Like Teen Spirit.mp3', cover: 'https://images.unsplash.com/photo-1516280440502-863a346513c0?w=100&h=100&fit=crop' },
  { title: 'Feel Good Inc.', artist: 'Gorillaz', url: '/music/Gorillaz - Feel Good Inc. (Official Video).mp3', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop' },
  { title: 'Holiday', artist: 'Green Day', url: '/music/Green Day - Holiday (Official Audio).mp3', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop' },
  { title: 'Radioactive', artist: 'Imagine Dragons', url: '/music/Imagine Dragons - Radioactive.mp3', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&h=100&fit=crop' },
  { title: 'Fight Back', artist: 'NEFFEX', url: '/music/NEFFEX - Fight Back [Official Video] No.37 [CYDP_8UTAus].mp3', cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop' },
  { title: 'Grateful', artist: 'NEFFEX', url: '/music/NEFFEX - Grateful Copyright Free No.54.mp3', cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop' },
  { title: 'The Search', artist: 'NF', url: '/music/NF - The Search.mp3', cover: 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?w=100&h=100&fit=crop' },
  { title: 'Feel Invincible', artist: 'Skillet', url: '/music/Skillet - Feel Invincible Official Music Video.mp3', cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop' },
  { title: 'My Demons', artist: 'STARSET', url: '/music/STARSET - My Demons.mp3', cover: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100&h=100&fit=crop' },
  { title: 'Courtesy Call', artist: 'Thousand Foot Krutch', url: '/music/Thousand Foot Krutch - Courtesy Call.mp3', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&h=100&fit=crop' },
  { title: 'Animal I Have Become', artist: 'Three Days Grace', url: '/music/Three Days Grace - Animal I Have Become - (320 Kbps).mp3', cover: 'https://images.unsplash.com/photo-1543165365-07232cc5b492?w=100&h=100&fit=crop' },
  { title: 'Stressed Out', artist: 'twenty one pilots', url: '/music/twenty one pilots Stressed Out OFFICIAL VIDEO.mp3', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=100&h=100&fit=crop' },
]

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [expanded, setExpanded] = useState(false)
  
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const changeTrack = (index: number) => {
    setCurrentTrack(index)
    setIsPlaying(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  return (
    <div className="music-player-wrapper" style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '15px'
    }}>
      
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url}
        onEnded={() => changeTrack((currentTrack + 1) % TRACKS.length)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* 👇 VISTA EXPANDIDA (Panel completo) 👇 */}
      {expanded && (
        <div className="expanded-player" style={{
          background: 'rgba(20, 20, 24, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '20px',
          width: '320px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          animation: 'slideUp 0.3s ease'
        }}>
          
          {/* Header con botón de cerrar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '1px' }}>REPRODUCIENDO</span>
            <button onClick={() => setExpanded(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          {/* Info de la canción actual (estilo vinilo chico) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img 
              src={TRACKS[currentTrack].cover} 
              alt="Cover" 
              style={{ 
                width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover',
                border: '2px solid var(--accent)',
                animation: isPlaying ? 'spin 4s linear infinite' : 'none'
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {TRACKS[currentTrack].title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                {TRACKS[currentTrack].artist}
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="custom-range"
              style={{
                width: '100%', height: '6px', appearance: 'none', borderRadius: '3px', cursor: 'pointer', outline: 'none',
                background: `linear-gradient(to right, var(--accent) ${(currentTime / duration) * 100}%, #2a2a32 ${(currentTime / duration) * 100}%)`
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginTop: '5px', fontFamily: 'monospace' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controles (Atrás, Play/Pausa, Adelante) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '25px', margin: '5px 0' }}>
            <button onClick={() => changeTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>
              ⏮
            </button>
            <button onClick={togglePlay} style={{ 
              background: 'var(--accent)', border: 'none', borderRadius: '50%', width: '55px', height: '55px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.5rem',
              boxShadow: '0 0 20px var(--accent)'
            }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={() => changeTrack((currentTrack + 1) % TRACKS.length)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>
              ⏭
            </button>
          </div>

          {/* Playlist */}
          <div style={{ marginTop: '10px' }}>
            <h4 style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Playlist ({TRACKS.length} canciones)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
              {TRACKS.map((track, index) => (
                <div
                  key={index}
                  onClick={() => changeTrack(index)}
                  style={{
                    padding: '8px', borderRadius: '8px', cursor: 'pointer',
                    background: currentTrack === index ? 'rgba(255, 90, 31, 0.15)' : 'transparent',
                    color: currentTrack === index ? 'var(--accent)' : 'var(--text)',
                    fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s'
                  }}
                >
                  <img src={track.cover} alt="cover" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 👇 VISTA COLAPSADA (Solo el disco de vinilo girando) 👇 */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="vinyl-record"
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: isPlaying ? '0 0 25px var(--accent)' : '0 8px 25px rgba(0,0,0,0.5)',
          border: isPlaying ? '2px solid var(--accent)' : '2px solid #2a2a32',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111'
        }}
      >
        {/* Imagen de la canción que gira */}
        <img 
          src={TRACKS[currentTrack].cover} 
          alt="Cover" 
          style={{ 
            width: '100%', height: '100%', objectFit: 'cover',
            animation: isPlaying ? 'spin 4s linear infinite' : 'none'
          }} 
        />
        
        {/* Agujerito central del vinilo (efecto óptico) */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '16px', height: '16px', background: '#0a0a0c', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.2)', zIndex: 2
        }}></div>

        {/* Icono de Play superpuesto si está en pausa */}
        {!isPlaying && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: '#fff', fontSize: '1.5rem', zIndex: 1
          }}>
            ▶
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vinyl-record:hover {
          transform: scale(1.05);
        }
        
        /* Estilos para que el rango (barra de progreso) se vea bien en navegadores */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 10px var(--accent);
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  )
}

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
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '10px'
    }}>
      
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrack].url}
        onEnded={() => changeTrack((currentTrack + 1) % TRACKS.length)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* Contenedor principal del reproductor (Pastilla) */}
      <div style={{
        background: 'rgba(20, 20, 24, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #2a2a32',
        borderRadius: '50px', 
        padding: '8px 16px 8px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        transition: 'all 0.3s ease',
        width: expanded ? '280px' : 'auto',
        overflow: 'hidden'
      }}>
        
        {/* Foto del artista / Cover */}
        <div 
          onClick={() => setExpanded(!expanded)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <img 
            src={TRACKS[currentTrack].cover} 
            alt="Cover" 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: isPlaying ? '2px solid var(--accent)' : '2px solid transparent',
              animation: isPlaying ? 'spin 10s linear infinite' : 'none'
            }} 
          />
          {!isPlaying && (
            <div style={{
              position: 'absolute', inset: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)', borderRadius: '50%', color: 'white'
            }}>
              ▶
            </div>
          )}
        </div>

        {/* Info de la canción */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {TRACKS[currentTrack].title}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
            {TRACKS[currentTrack].artist}
          </div>
        </div>

        {/* Botón Play/Pausa principal */}
        <button 
          onClick={togglePlay} 
          style={{ 
            background: 'var(--accent)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            color: '#fff', 
            fontSize: '1rem',
            flexShrink: 0
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Panel expandido (Barra de progreso y lista) */}
      {expanded && (
        <div style={{
          background: 'rgba(20, 20, 24, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid #2a2a32',
          borderRadius: '16px',
          padding: '15px',
          width: '280px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          marginTop: '-5px'
        }}>
          {/* Barra de progreso */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '5px', fontFamily: 'monospace' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: '100%',
              height: '4px',
              appearance: 'none',
              background: `linear-gradient(to right, var(--accent) ${(currentTime / duration) * 100}%, #2a2a32 ${(currentTime / duration) * 100}%)`,
              borderRadius: '2px',
              cursor: 'pointer',
              outline: 'none',
              marginBottom: '15px'
            }}
          />

          {/* Lista de canciones */}
          <h4 style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Playlist ({TRACKS.length} canciones)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
            {TRACKS.map((track, index) => (
              <div
                key={index}
                onClick={() => changeTrack(index)}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: currentTrack === index ? 'rgba(255, 90, 31, 0.15)' : 'transparent',
                  color: currentTrack === index ? 'var(--accent)' : 'var(--text)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <img src={track.cover} alt="cover" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

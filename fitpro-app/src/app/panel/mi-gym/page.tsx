'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MiGymPage() {
  const router = useRouter()
  const supabase = createClient()
  const [gym, setGym] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle()
      setGym(data)
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  function actualizar(campo: string, valor: string) {
    if (!gym) return
    setGym({ ...gym, [campo]: valor })
  }

  async function subirImagen(e: React.ChangeEvent<HTMLInputElement>, campo: string) {
    const file = e.target.files?.[0]
    if (!file || !gym) return

    setSubiendo(campo)
    const fileExt = file.name.split('.').pop()
    const fileName = `${gym.id}-${campo}-${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from('imagenes').upload(fileName, file)
    
    if (error) {
      alert('Error al subir la imagen: ' + error.message)
      setSubiendo(null)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('imagenes').getPublicUrl(fileName)
    actualizar(campo, publicUrl)
    setSubiendo(null)
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!gym) return
    setGuardando(true)
    setMensaje('')

    const { error } = await supabase.from('gyms').update({
        nombre: gym.nombre, sufijo: gym.sufijo, slug: gym.slug, descripcion: gym.descripcion,
        titulo_hero: gym.titulo_hero, subtitulo_hero: gym.subtitulo_hero, logo_url: gym.logo_url,
        hero_img_url: gym.hero_img_url, sobre_mi_img_url: gym.sobre_mi_img_url,
        color_primario: gym.color_primario, color_secundario: gym.color_secundario,
        whatsapp: gym.whatsapp, email_contacto: gym.email_contacto, telefono: gym.telefono,
        direccion: gym.direccion, ciudad: gym.ciudad, pais: gym.pais,
        instagram: gym.instagram, youtube: gym.youtube, tiktok: gym.tiktok,
      }).eq('id', gym.id)

    setGuardando(false)
    if (error) { setMensaje('❌ Error: ' + error.message) } 
    else {
      setMensaje('✅ Cambios guardados correctamente')
      setTimeout(() => setMensaje(''), 4000)
    }
  }

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Cargando...</div>

  // 👇 PROTECCIÓN MÁGICA: Si no hay gym, mostramos un mensaje en vez de colapsar
  if (!gym) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#fff' }}>Todavía no tenés un gimnasio creado</h2>
        <Link href="/panel" className="btn">Volver al panel para crearlo</Link>
      </div>
    )
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></Link>
          <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>← Volver al panel</Link>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Mi Gym</h1>
          <p className="section-sub">Configurá los datos de tu gimnasio. Todo lo que cambies acá se va a ver en tu página pública.</p>
        </div>

        <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
          
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', textTransform: 'uppercase' }}>Identidad</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div><label>Nombre</label><input type="text" value={gym.nombre || ''} onChange={(e) => actualizar('nombre', e.target.value)} required /></div>
            <div><label>Sufijo</label><input type="text" value={gym.sufijo || ''} onChange={(e) => actualizar('sufijo', e.target.value)} /></div>
            <div>
              <label>Código de Invitación</label>
              <input type="text" value={gym.codigo_invitacion || ''} readOnly style={{ background: 'var(--bg-2)', color: 'var(--accent)', fontWeight: 'bold', textAlign: 'center', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #2a2a32' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '5px' }}>Pasale este código a tus alumnos.</p>
            </div>
            <div><label>Slug (URL)</label><input type="text" value={gym.slug || ''} onChange={(e) => actualizar('slug', e.target.value)} required /><p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '5px' }}>Tu web: /{gym.slug}</p></div>
          </div>

          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', textTransform: 'uppercase' }}>Página Principal</h3>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
            <div><label>Título principal</label><input type="text" value={gym.titulo_hero || ''} onChange={(e) => actualizar('titulo_hero', e.target.value)} /></div>
            <div><label>Subtítulo</label><input type="text" value={gym.subtitulo_hero || ''} onChange={(e) => actualizar('subtitulo_hero', e.target.value)} /></div>
            <div><label>Descripción</label><textarea rows={3} value={gym.descripcion || ''} onChange={(e) => actualizar('descripcion', e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #2a2a32', background: 'var(--card)', color: '#fff', width: '100%' }} /></div>
          </div>

          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', textTransform: 'uppercase' }}>Imágenes (Subir archivos)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>Logo</label>
              <input type="file" accept="image/*" onChange={(e) => subirImagen(e, 'logo_url')} style={{ width: '100%', padding: '10px', background: 'var(--bg-2)', borderRadius: '8px', border: '1px solid #2a2a32' }} />
              {subiendo === 'logo_url' && <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Subiendo...</p>}
              {gym.logo_url && <img src={gym.logo_url} alt="Logo" style={{ height: '40px', marginTop: '10px', borderRadius: '4px' }} />}
            </div>
            <div>
              <label>Imagen de Fondo (Hero)</label>
              <input type="file" accept="image/*" onChange={(e) => subirImagen(e, 'hero_img_url')} style={{ width: '100%', padding: '10px', background: 'var(--bg-2)', borderRadius: '8px', border: '1px solid #2a2a32' }} />
              {subiendo === 'hero_img_url' && <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Subiendo...</p>}
              {gym.hero_img_url && <img src={gym.hero_img_url} alt="Hero" style={{ height: '40px', marginTop: '10px', borderRadius: '4px', objectFit: 'cover' }} />}
            </div>
            <div>
              <label>Imagen "Sobre mí"</label>
              <input type="file" accept="image/*" onChange={(e) => subirImagen(e, 'sobre_mi_img_url')} style={{ width: '100%', padding: '10px', background: 'var(--bg-2)', borderRadius: '8px', border: '1px solid #2a2a32' }} />
              {subiendo === 'sobre_mi_img_url' && <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Subiendo...</p>}
              {gym.sobre_mi_img_url && <img src={gym.sobre_mi_img_url} alt="Sobre mi" style={{ height: '40px', marginTop: '10px', borderRadius: '4px', objectFit: 'cover' }} />}
            </div>
          </div>

          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', textTransform: 'uppercase' }}>Colores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div><label>Color Primario</label><div style={{ display: 'flex', gap: '10px' }}><input type="color" value={gym.color_primario || '#ff5a1f'} onChange={(e) => actualizar('color_primario', e.target.value)} style={{ width: '50px', height: '45px', padding: '4px' }} /><input type="text" value={gym.color_primario || ''} onChange={(e) => actualizar('color_primario', e.target.value)} /></div></div>
            <div><label>Color Secundario</label><div style={{ display: 'flex', gap: '10px' }}><input type="color" value={gym.color_secundario || '#111111'} onChange={(e) => actualizar('color_secundario', e.target.value)} style={{ width: '50px', height: '45px', padding: '4px' }} /><input type="text" value={gym.color_secundario || ''} onChange={(e) => actualizar('color_secundario', e.target.value)} /></div></div>
          </div>

          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', textTransform: 'uppercase' }}>Contacto</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div><label>WhatsApp</label><input type="text" value={gym.whatsapp || ''} onChange={(e) => actualizar('whatsapp', e.target.value)} /></div>
            <div><label>Email</label><input type="email" value={gym.email_contacto || ''} onChange={(e) => actualizar('email_contacto', e.target.value)} /></div>
            <div><label>Teléfono</label><input type="text" value={gym.telefono || ''} onChange={(e) => actualizar('telefono', e.target.value)} /></div>
            <div><label>Dirección</label><input type="text" value={gym.direccion || ''} onChange={(e) => actualizar('direccion', e.target.value)} /></div>
            <div><label>Ciudad</label><input type="text" value={gym.ciudad || ''} onChange={(e) => actualizar('ciudad', e.target.value)} /></div>
            <div><label>País</label><input type="text" value={gym.pais || ''} onChange={(e) => actualizar('pais', e.target.value)} /></div>
          </div>

          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', textTransform: 'uppercase' }}>Redes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div><label>Instagram</label><input type="text" value={gym.instagram || ''} onChange={(e) => actualizar('instagram', e.target.value)} /></div>
            <div><label>YouTube</label><input type="text" value={gym.youtube || ''} onChange={(e) => actualizar('youtube', e.target.value)} /></div>
            <div><label>TikTok</label><input type="text" value={gym.tiktok || ''} onChange={(e) => actualizar('tiktok', e.target.value)} /></div>
          </div>

          {mensaje && <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '20px', background: mensaje.includes('✅') ? 'rgba(34,197,94,.15)' : 'rgba(230,74,16,.15)', border: `1px solid ${mensaje.includes('✅') ? '#22c55e' : '#e64a10'}`, color: mensaje.includes('✅') ? '#86efac' : '#fca5a5' }}>{mensaje}</div>}

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button type="submit" className="btn" disabled={guardando}>{guardando ? 'Guardando...' : '💾 Guardar cambios'}</button>
            <Link href={`/${gym.slug}`} target="_blank" className="btn btn-outline">🌐 Ver mi página pública</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

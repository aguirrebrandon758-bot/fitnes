'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Gym = {
  id: string
  owner_id: string
  slug: string
  nombre: string
  sufijo: string | null
  descripcion: string | null
  titulo_hero: string | null
  subtitulo_hero: string | null
  logo_url: string | null
  hero_img_url: string | null
  sobre_mi_img_url: string | null
  color_primario: string | null
  color_secundario: string | null
  whatsapp: string | null
  email_contacto: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  pais: string | null
  instagram: string | null
  youtube: string | null
  tiktok: string | null
}

export default function MiGymPage() {
  const router = useRouter()
  const supabase = createClient()

  const [gym, setGym] = useState<Gym | null>(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle()

      setGym(data)
      setCargando(false)
    }
    cargar()
  }, [router, supabase])

  function actualizar(campo: keyof Gym, valor: string) {
    if (!gym) return
    setGym({ ...gym, [campo]: valor })
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!gym) return

    setGuardando(true)
    setMensaje('')

    const { error } = await supabase
      .from('gyms')
      .update({
        nombre: gym.nombre,
        sufijo: gym.sufijo,
        slug: gym.slug,
        descripcion: gym.descripcion,
        titulo_hero: gym.titulo_hero,
        subtitulo_hero: gym.subtitulo_hero,
        logo_url: gym.logo_url,
        hero_img_url: gym.hero_img_url,
        sobre_mi_img_url: gym.sobre_mi_img_url,
        color_primario: gym.color_primario,
        color_secundario: gym.color_secundario,
        whatsapp: gym.whatsapp,
        email_contacto: gym.email_contacto,
        telefono: gym.telefono,
        direccion: gym.direccion,
        ciudad: gym.ciudad,
        pais: gym.pais,
        instagram: gym.instagram,
        youtube: gym.youtube,
        tiktok: gym.tiktok,
      })
      .eq('id', gym.id)

    setGuardando(false)

    if (error) {
      setMensaje('❌ Error: ' + error.message)
    } else {
      setMensaje('✅ Cambios guardados correctamente')
      setTimeout(() => setMensaje(''), 4000)
    }
  }

  if (cargando) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container">
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!gym) {
    return (
      <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div className="container">
          <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>
              FIT<span>PRO</span>
            </Link>
          </header>
          <div className="service-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ marginBottom: '20px' }}>No tenés un gym asignado</h2>
            <p style={{ color: 'var(--muted)' }}>Contactá al administrador para crear tu gym.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        {/* Header */}
        <header style={{ position: 'static', background: 'transparent', border: 'none', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <Link href="/panel" className="logo" style={{ fontSize: '1.8rem' }}>
              FIT<span>PRO</span>
            </Link>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
  <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
    🏠 Panel
  </Link>
  <Link href="/panel/ejercicios" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
    📋 Ejercicios
  </Link>
  <Link href="/panel/rutinas" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
    🏋️ Rutinas
  </Link>
  <Link href="/panel/alimentos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
    🍎 Alimentos
  </Link>
  <Link href="/panel/videos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>
    🎥 Videos
  </Link>
</div>
          </div>
        </header>

        {/* Título */}
        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">Mi Gym</h1>
          <p className="section-sub" style={{ marginBottom: 0 }}>
            Editá la información de tu gimnasio. Lo que cambies acá se ve en la página pública.
          </p>
        </div>

        <form onSubmit={guardar} className="service-card" style={{ padding: '35px' }}>
          {/* Sección: Identidad */}
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Identidad
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>Nombre</label>
              <input type="text" value={gym.nombre || ''} onChange={(e) => actualizar('nombre', e.target.value)} required />
            </div>
            <div>
              <label>Sufijo (opcional)</label>
              <input type="text" value={gym.sufijo || ''} onChange={(e) => actualizar('sufijo', e.target.value)} placeholder="Ej: Demo" />
            </div>
            <div>
              <label>Slug (URL)</label>
              <input type="text" value={gym.slug || ''} onChange={(e) => actualizar('slug', e.target.value)} required placeholder="mi-gym" />
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '5px' }}>
                Tu web será: /{gym.slug}
              </p>
            </div>
          </div>

          {/* Sección: Hero */}
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Página principal
          </h3>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>Título principal</label>
              <input type="text" value={gym.titulo_hero || ''} onChange={(e) => actualizar('titulo_hero', e.target.value)} placeholder="Transforma tu cuerpo en" />
            </div>
            <div>
              <label>Subtítulo</label>
              <input type="text" value={gym.subtitulo_hero || ''} onChange={(e) => actualizar('subtitulo_hero', e.target.value)} placeholder="90 días" />
            </div>
            <div>
              <label>Descripción</label>
              <textarea
                rows={3}
                value={gym.descripcion || ''}
                onChange={(e) => actualizar('descripcion', e.target.value)}
                placeholder="Entrenador personal certificado..."
                style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #2a2a32', background: 'var(--card)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '1rem', width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Sección: Imágenes */}
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Imágenes (URLs)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>Logo (URL)</label>
              <input type="text" value={gym.logo_url || ''} onChange={(e) => actualizar('logo_url', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label>Imagen del hero (URL)</label>
              <input type="text" value={gym.hero_img_url || ''} onChange={(e) => actualizar('hero_img_url', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label>Imagen "Sobre mí" (URL)</label>
              <input type="text" value={gym.sobre_mi_img_url || ''} onChange={(e) => actualizar('sobre_mi_img_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>

          {/* Sección: Colores */}
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Colores
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>Color primario</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={gym.color_primario || '#ff5a1f'}
                  onChange={(e) => actualizar('color_primario', e.target.value)}
                  style={{ width: '60px', height: '45px', padding: '4px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={gym.color_primario || ''}
                  onChange={(e) => actualizar('color_primario', e.target.value)}
                  placeholder="#ff5a1f"
                />
              </div>
            </div>
            <div>
              <label>Color secundario</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={gym.color_secundario || '#111111'}
                  onChange={(e) => actualizar('color_secundario', e.target.value)}
                  style={{ width: '60px', height: '45px', padding: '4px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={gym.color_secundario || ''}
                  onChange={(e) => actualizar('color_secundario', e.target.value)}
                  placeholder="#111111"
                />
              </div>
            </div>
          </div>

          {/* Sección: Contacto */}
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Contacto
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>WhatsApp</label>
              <input type="text" value={gym.whatsapp || ''} onChange={(e) => actualizar('whatsapp', e.target.value)} placeholder="+5491123456789" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={gym.email_contacto || ''} onChange={(e) => actualizar('email_contacto', e.target.value)} placeholder="hola@migym.com" />
            </div>
            <div>
              <label>Teléfono</label>
              <input type="text" value={gym.telefono || ''} onChange={(e) => actualizar('telefono', e.target.value)} placeholder="+54 9 11..." />
            </div>
            <div>
              <label>Dirección</label>
              <input type="text" value={gym.direccion || ''} onChange={(e) => actualizar('direccion', e.target.value)} placeholder="Av. Corrientes 1234" />
            </div>
            <div>
              <label>Ciudad</label>
              <input type="text" value={gym.ciudad || ''} onChange={(e) => actualizar('ciudad', e.target.value)} placeholder="Buenos Aires" />
            </div>
            <div>
              <label>País</label>
              <input type="text" value={gym.pais || ''} onChange={(e) => actualizar('pais', e.target.value)} placeholder="Argentina" />
            </div>
          </div>

          {/* Sección: Redes */}
          <h3 style={{ color: 'var(--accent)', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Redes sociales
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            <div>
              <label>Instagram</label>
              <input type="text" value={gym.instagram || ''} onChange={(e) => actualizar('instagram', e.target.value)} placeholder="@migym" />
            </div>
            <div>
              <label>YouTube</label>
              <input type="text" value={gym.youtube || ''} onChange={(e) => actualizar('youtube', e.target.value)} placeholder="@migym" />
            </div>
            <div>
              <label>TikTok</label>
              <input type="text" value={gym.tiktok || ''} onChange={(e) => actualizar('tiktok', e.target.value)} placeholder="@migym" />
            </div>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              marginBottom: '20px',
              background: mensaje.startsWith('✅') ? 'rgba(34,197,94,.15)' : 'rgba(230,74,16,.15)',
              border: mensaje.startsWith('✅') ? '1px solid #22c55e' : '1px solid #e64a10',
              color: mensaje.startsWith('✅') ? '#86efac' : '#fca5a5',
            }}>
              {mensaje}
            </div>
          )}

          {/* Botón guardar */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button type="submit" className="btn" disabled={guardando}>
              {guardando ? 'Guardando...' : '💾 Guardar cambios'}
            </button>
            <Link
              href={`/${gym.slug}`}
              target="_blank"
              className="btn btn-outline"
            >
              🌐 Ver mi página pública
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

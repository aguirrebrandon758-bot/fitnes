'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateGymForm() {
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('No estás logueado.')
      setLoading(false)
      return
    }

    // Limpiamos el slug para que no tenga espacios ni caracteres raros
    const slugLimpio = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    const codigo = `${slugLimpio.substring(0, 8).toUpperCase()}${Math.floor(Math.random() * 10000)}`

    // Insertamos directo en la base de datos
    const { error: insertError } = await supabase.from('gyms').insert({
      owner_id: user.id,
      nombre: nombre.trim(),
      slug: slugLimpio,
      codigo_invitacion: codigo,
      activo: true
    })

    if (insertError) {
      // Si el slug ya existe, Postgres tira un error específico
      if (insertError.code === '23505') {
        setError('Esa URL ya está en uso. Probá con otra (ej: fitzone-2).')
      } else {
        setError('Error al crear el gym: ' + insertError.message)
      }
      setLoading(false)
      return
    }

    // Si todo sale bien, recargamos la página para que el servidor detecte el nuevo gym
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', textAlign: 'left', marginTop: '20px' }}>
      
      {error && (
        <div style={{ padding: '12px', background: 'rgba(230,74,16,.15)', border: '1px solid #e64a10', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ color: '#e4e4e7', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Nombre de tu Gym</label>
        <input 
          type="text" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          placeholder="Ej: FitZone" 
          required 
          style={{ width: '100%', padding: '12px', background: '#17171b', color: '#fff', border: '1px solid #2a2a32', borderRadius: '8px' }}
        />
      </div>

      <div>
        <label style={{ color: '#e4e4e7', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>URL de tu página (sin espacios)</label>
        <input 
          type="text" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)} 
          placeholder="Ej: fitzone" 
          required 
          style={{ width: '100%', padding: '12px', background: '#17171b', color: '#fff', border: '1px solid #2a2a32', borderRadius: '8px' }}
        />
        <p style={{ color: '#71717a', fontSize: '0.75rem', marginTop: '5px' }}>Tu web será: /{slug.toLowerCase().replace(/\s+/g, '-')}</p>
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="btn" 
        style={{ marginTop: '15px', width: '100%', padding: '14px' }}
      >
        {loading ? 'Creando...' : 'Crear mi Gimnasio'}
      </button>
    </form>
  )
}

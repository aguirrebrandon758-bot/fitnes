import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import GymClient from './GymClient'

type Params = { params: Promise<{ slug: string }> }

async function GymContent({ params }: Params) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gym, error } = await supabase.from('gyms').select('*').eq('slug', slug).maybeSingle()

  if (error || !gym) {
    return (
      <div style={{ minHeight: '100vh', background: '#0e0e10', color: '#fff', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#ff5a1f', fontSize: '2rem', marginBottom: '20px' }}>⚠️ Error de Carga</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No se encontró el gimnasio con la URL: <strong>/{slug}</strong></p>
        <Link href="/admin" style={{ background: '#ff5a1f', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Volver al Admin</Link>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.email === 'aguirrebrandon758@gmail.com' || user?.id === gym.owner_id

  const [
    { data: servicios },
    { data: ejercicios },
    { data: rutinas },
    { data: rutinaEjercicios },
    { data: posts },
    { data: videos },
    { data: alimentos },
    { data: testimonios },
    { data: galeria },
  ] = await Promise.all([
    supabase.from('servicios').select('*').eq('gym_id', gym.id),
    supabase.from('ejercicios').select('*').eq('gym_id', gym.id),
    supabase.from('rutinas').select('*').eq('gym_id', gym.id),
    supabase.from('rutina_ejercicios').select('*'),
    supabase.from('posts').select('*').eq('gym_id', gym.id),
    supabase.from('videos').select('*').eq('gym_id', gym.id),
    supabase.from('alimentos').select('*').eq('gym_id', gym.id),
    supabase.from('testimonios').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false }),
    supabase.from('galeria').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false }),
  ])

  return (
    <GymClient
      gym={gym}
      isOwner={isOwner}
      servicios={servicios || []}
      ejercicios={ejercicios || []}
      rutinas={rutinas || []}
      rutinaEjercicios={rutinaEjercicios || []}
      posts={posts || []}
      videos={videos || []}
      alimentos={alimentos || []}
      testimonios={testimonios || []}
      galeria={galeria || []}
    />
  )
}

export default function GymPage({ params }: Params) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e10', color: 'var(--accent)' }}>Cargando...</div>}>
      <GymContent params={params} />
    </Suspense>
  )
}

import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GymClient from './GymClient'

type Params = { params: Promise<{ slug: string }> }

async function GymContent({ params }: Params) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gym } = await supabase.from('gyms').select('*').eq('slug', slug).eq('activo', true).maybeSingle()
  if (!gym) notFound()

  const [
    { data: servicios },
    { data: ejercicios },
    { data: rutinas },
    { data: rutinaEjercicios },
    { data: posts },
    { data: videos },
    { data: alimentos },
    { data: testimonios },
  ] = await Promise.all([
    supabase.from('servicios').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('ejercicios').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('rutinas').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('rutina_ejercicios').select('*'),
    supabase.from('posts').select('*').eq('gym_id', gym.id).eq('publicado', true),
    supabase.from('videos').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('alimentos').select('*').eq('gym_id', gym.id),
    supabase.from('testimonios').select('*').eq('gym_id', gym.id).order('creado_en', { ascending: false }),
  ])

  return (
    <GymClient
      gym={gym}
      servicios={servicios || []}
      ejercicios={ejercicios || []}
      rutinas={rutinas || []}
      rutinaEjercicios={rutinaEjercicios || []}
      posts={posts || []}
      videos={videos || []}
      alimentos={alimentos || []}
      testimonios={testimonios || []}
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

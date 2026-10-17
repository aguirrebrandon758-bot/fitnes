import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GymClient from './GymClient'

type Params = { params: Promise<{ slug: string }> }

// 1. Componente que hace la consulta a la base de datos
async function GymContent({ params }: Params) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gym } = await supabase
    .from('gyms')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .maybeSingle()

  if (!gym) notFound()

  const [
    { data: servicios },
    { data: ejercicios },
    { data: rutinas },
    { data: rutinaEjercicios },
    { data: posts },
    { data: videos },
    { data: alimentos },
  ] = await Promise.all([
    supabase.from('servicios').select('*').eq('gym_id', gym.id).eq('activo', true).order('orden'),
    supabase.from('ejercicios').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('rutinas').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('rutina_ejercicios').select('*'),
    supabase.from('posts').select('*').eq('gym_id', gym.id).eq('publicado', true),
    supabase.from('videos').select('*').eq('gym_id', gym.id).eq('activo', true).order('orden'),
    supabase.from('alimentos').select('*').eq('gym_id', gym.id),
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
    />
  )
}

// 2. Componente principal que envuelve todo en Suspense
export default function GymPage({ params }: Params) {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--accent)',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        Cargando tu gimnasio...
      </div>
    }>
      <GymContent params={params} />
    </Suspense>
  )
}

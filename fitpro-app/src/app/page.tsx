import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GymClient from './GymClient'


type Params = { params: Promise<{ slug: string }> }

export default async function GymPage({ params }: Params) {
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
    supabase.from('alimentos').select('*').is('gym_id', null),
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
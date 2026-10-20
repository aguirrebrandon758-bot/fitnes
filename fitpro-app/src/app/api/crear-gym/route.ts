import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const formData = await request.formData()
  const nombre = formData.get('nombre') as string
  const slug = formData.get('slug') as string

  if (!nombre || !slug) {
    return NextResponse.redirect(new URL('/panel', request.url))
  }

  // Generar un código de invitación único
  const codigo = `${slug.toUpperCase().replace(/[^A-Z0-9]/g, '')}${Math.floor(Math.random() * 10000)}`

  await supabase.from('gyms').insert({
    owner_id: user.id,
    nombre,
    slug: slug.toLowerCase().replace(/\s+/g, '-'),
    codigo_invitacion: codigo,
    activo: true
  })

  return NextResponse.redirect(new URL('/panel', request.url))
}

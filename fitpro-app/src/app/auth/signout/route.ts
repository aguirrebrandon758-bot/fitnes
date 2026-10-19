import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // El status 303 fuerza un GET en la redirección, evitando el error 405
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 })
}

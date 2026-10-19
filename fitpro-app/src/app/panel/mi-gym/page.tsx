import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MiGymPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: gym } = await supabase.from('gyms').select('*').eq('owner_id', user.id).maybeSingle()

  if (!gym) redirect('/panel')

  return (
    <div className="fondo-animado" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div className="logo" style={{ fontSize: '1.8rem' }}>FIT<span>PRO</span></div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/panel" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>🏠 Panel</Link>
            <Link href="/panel/ejercicios" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>📋 Ejercicios</Link>
            <Link href="/panel/rutinas" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>🏋️ Rutinas</Link>
            <Link href="/panel/alimentos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>🍎 Alimentos</Link>
            <Link href="/panel/videos" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>🎥 Videos</Link>
            <Link href="/panel/testimonios" className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)' }}>💬 Testimonios</Link>
          </div>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <h1 className="section-title">{gym.nombre} {gym.sufijo}</h1>
          <p className="section-sub">Bienvenido a tu espacio de gestión.</p>
        </div>

        <div className="service-card" style={{ padding: '40px', textAlign: 'center', borderColor: 'var(--accent)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Este es el espacio de tu gimnasio</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>Para que tu página pública se vea bien, empezá cargando contenido.</p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/panel/mi-gym/editar" className="btn">⚙️ Editar datos de mi Gym</Link>
            <Link href={`/${gym.slug}`} target="_blank" className="btn btn-outline">🌐 Ver mi página pública</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

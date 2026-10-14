import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'


type Params = { params: Promise<{ slug: string }> }

export default async function GymPage({ params }: Params) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gym, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (error || !gym) {
    console.error('Gym no encontrado:', error)
    notFound()
  }

  const [
    { data: servicios },
    { data: ejercicios },
    { data: posts },
    { data: videos },
    { data: alimentos },
  ] = await Promise.all([
    supabase.from('servicios').select('*').eq('gym_id', gym.id).eq('activo', true).order('orden'),
    supabase.from('ejercicios').select('*').eq('gym_id', gym.id).eq('activo', true),
    supabase.from('posts').select('*').eq('gym_id', gym.id).eq('publicado', true),
    supabase.from('videos').select('*').eq('gym_id', gym.id).eq('activo', true).order('orden'),
    supabase.from('alimentos').select('*').is('gym_id', null),
  ])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {gym.nombre}
          <span style={{ color: gym.color_primario }}>{gym.sufijo}</span>
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>
          {gym.titulo_hero} <span style={{ color: gym.color_primario }}>{gym.subtitulo_hero}</span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#444', maxWidth: '600px' }}>{gym.descripcion}</p>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h2>Servicios</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {servicios?.map((s) => (
            <div key={s.id} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
              <h3>{s.nombre}</h3>
              <p style={{ color: gym.color_primario, fontWeight: 'bold' }}>
                ${Number(s.precio).toLocaleString('es-AR')} {s.moneda}
              </p>
              <p style={{ color: '#666' }}>{s.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2>Ejercicios ({ejercicios?.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {ejercicios?.map((e) => (
            <div key={e.id} style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              <strong>{e.nombre}</strong>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {e.grupo_muscular} · {e.dificultad}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2>Blog</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {posts?.map((p) => (
            <article key={p.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: gym.color_primario, fontWeight: 'bold' }}>{p.tag}</span>
              <h3 style={{ margin: '0.5rem 0' }}>{p.titulo}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{p.extracto}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2>Videos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {videos?.map((v) => (
            <div key={v.id}>
              <img
                src={`https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg`}
                alt={v.titulo || ''}
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <p style={{ fontSize: '0.9rem' }}>{v.titulo}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2>Guia de alimentos ({alimentos?.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Alimento</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Cat.</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Porcion</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Kcal</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>P</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>C</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>G</th>
            </tr>
          </thead>
          <tbody>
            {alimentos?.map((a) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.5rem' }}>{a.nombre}</td>
                <td style={{ padding: '0.5rem', color: '#666' }}>{a.categoria}</td>
                <td style={{ padding: '0.5rem', color: '#666' }}>{a.porcion}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{a.kcal}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{a.proteinas}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{a.carbohidratos}</td>
                <td style={{ padding: '0.5rem', textAlign: 'right' }}>{a.grasas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer style={{ borderTop: '1px solid #ddd', paddingTop: '2rem', color: '#666' }}>
        <p>{gym.email_contacto} · {gym.telefono}</p>
        <p>{gym.direccion}, {gym.ciudad}</p>
      </footer>
    </main>
  )
}

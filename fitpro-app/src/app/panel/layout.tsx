import MusicPlayer from '@/components/MusicPlayer'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MusicPlayer />
    </>
  )
}

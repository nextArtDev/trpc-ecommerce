export const metadata = {
  title: 'درباره ما',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="  min-h-screen">{children}</div>
}

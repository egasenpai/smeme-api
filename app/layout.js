export const metadata = {
  title: '🎭 SMEME - Meme Generator',
  description: 'Free Meme Generator with Full Emoji Support',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}

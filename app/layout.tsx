import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/Providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Melodia - AI Music Generator',
  description: 'Buat musik profesional dalam hitungan detik dengan AI',
  keywords: 'AI music, music generator, Suno AI, musik AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1f1f1f',
                color: '#fff',
                border: '1px solid #333',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}

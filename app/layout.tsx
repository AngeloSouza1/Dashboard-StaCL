// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import ThemeRegistry from './ThemeRegistry'

export const metadata: Metadata = {
  title: 'Análise Sta Clara',
  description: 'Created with AAFS',
  generator: 'V- 1.0',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* aqui todo o MUI/Emotion e DatePicker já estão configurados */}
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SocialUp Reviews - Staff Review Tracking & Analytics',
  description: 'Track and analyze staff mentions in customer reviews across multiple platforms. Part of the SocialUp suite.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#2563eb',
  robots: 'index, follow',
  openGraph: {
    title: 'SocialUp Reviews - Staff Review Tracking & Analytics',
    description: 'Track and analyze staff mentions in customer reviews across multiple platforms.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialUp Reviews - Staff Review Tracking & Analytics',
    description: 'Track and analyze staff mentions in customer reviews across multiple platforms.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

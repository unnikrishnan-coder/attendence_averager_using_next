import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Attendence Averager',
  description: 'An app to find the average of attendence',
  verification:{
    google:"FCBvFeKjRFE5tMs3bvgAz2xS9BC6fQ-fJTaRZI2FHCs"
  }
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
        <Analytics />
        <SpeedInsights />
        <ToastContainer />
      </body>
    </html>
  )
}

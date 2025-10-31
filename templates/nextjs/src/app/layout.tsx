import type { Metadata } from 'next'
import { FhevmProvider } from 'fhevm-sdk'
import './globals.css'

export const metadata: Metadata = {
  title: 'FHEVM Next.js App',
  description: 'Built with FHEVM SDK',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FhevmProvider network="sepolia">
          {children}
        </FhevmProvider>
      </body>
    </html>
  )
}

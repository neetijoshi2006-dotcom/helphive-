'use client'

import "./globals.css"
import { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <title>HelpHive — Intelligent Support Operations</title>
        <meta name="description" content="Intelligent support operations, beautifully designed. AI-powered ticket management, knowledge base, and analytics." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1D1D1F',
                color: '#F5F5F7',
                borderRadius: '16px',
                fontSize: '14px',
                fontFamily: "'DM Sans', sans-serif",
                padding: '12px 20px',
              },
            }}
          />
        </QueryClientProvider>
      </body>
    </html>
  )
}

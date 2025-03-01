'use client'

import '@sushiswap/ui/index.css'
import '../variables.css'

import { App, ThemeProvider } from '@sushiswap/ui'
import { client } from '@sushiswap/wagmi'
import Head from 'next/head'
import { WagmiConfig } from 'wagmi'

import React from 'react'
import { ToastContainer } from '@sushiswap/ui/future/components/toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#fa52a0" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
      </Head>
      <body className="h-screen">
        <WagmiConfig client={client}>
          <ThemeProvider>
            <App.Shell>
              {children}
              <App.Footer />
              <ToastContainer className="mt-[50px]" />
            </App.Shell>
            <div className="z-[-1] fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
          </ThemeProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}

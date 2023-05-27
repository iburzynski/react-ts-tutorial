import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { CardanoProvider, UseCardanoOptions } from 'use-cardano'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
const options: UseCardanoOptions = {
  allowedNetworks: ["Testnet"],
  testnetNetwork: "Preview",
  node: {
    provider: "blockfrost",
    projectId
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
        },
        typography: {
          fontSize: 18
        },
      }),
    []
  )
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CardanoProvider options={options}>
        <Component {...pageProps} />
      </CardanoProvider >
    </ThemeProvider>
  )
}

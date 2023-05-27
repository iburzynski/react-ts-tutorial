import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { CardanoToaster, CardanoWalletSelector } from 'use-cardano'
import Contract from '@/components/Contract'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>🎁 Gift Contract</title>
        <meta name="description" content="Sample Next.js app with Lucid" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <h1>🎁 Gift Contract</h1>
          <div>
            <CardanoWalletSelector/>
            <CardanoToaster/>
          </div>
        </div>

        <div className={styles.center}>
          <Contract/>
        </div>
      </main>
    </>
  )
}

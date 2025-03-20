import Script from 'next/script'
import LinkPage from './linkpage'

export default async function Page() {
  return (
    <>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6202902142885850"
        crossOrigin="anonymous" />
      <LinkPage />
    </>
  )
}
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
				<meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
				<meta name="google-site-verification" content="ow_oF7MNe6yvFGciKZqQyl9EIpr-DJ8yxzjhHfY3tIY" />
        <link rel="icon" href="/favicon.ico" />
			</Head>
      <body className='bg-white dark:bg-dark'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
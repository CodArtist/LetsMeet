import '../styles/globals.css'
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
  <NextNProgress options={{showSpinner:false}} height={5} color='#9e06bd'/>
  <Component {...pageProps} />
  </>
  )
}

export default MyApp

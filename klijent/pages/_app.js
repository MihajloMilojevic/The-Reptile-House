import Head from "next/head";
import {Footer, Navbar, ScrollToTop} from "../components";
import "../styles/globals.css";
import ContextProvider from "../context/ContextProvider";

import 'react-notifications/lib/notifications.css';

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/logo-no-bg.png"/>
      </Head>
      <Navbar />
      <ScrollToTop />
      <div style={{minHeight:"75vh", margin: 0, padding: 0}}>
        <Component {...pageProps} /> 
      </div>
      {/* <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /> */}
      <Footer />
    </ContextProvider>
  )
}

export default MyApp

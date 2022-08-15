import Head from "next/head";
import {Footer, Navbar, ScrollToTop} from "../components";
import "../styles/globals.css";
import "../styles/override.css";
import ContextProvider, { useStateContext } from "../context/ContextProvider";

import 'react-notifications/lib/notifications.css';
import "react-alice-carousel/lib/alice-carousel.css";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function MyApp({ Component, pageProps }) {

  return (
    <ContextProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/logo-no-bg.png"/>
      </Head>
      <Navbar/>
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

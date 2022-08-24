import '../styles/globals.css'

import 'react-notifications/lib/notifications.css';

import ContextProvider from "../context/ContextProvider";
import {Layout} from "../components";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {

	return (
		<ContextProvider>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/logo-no-bg.png"/>
			</Head>
			<Layout>
				<Component {...pageProps} /> 
			</Layout>
		</ContextProvider>
	)
}

export default MyApp

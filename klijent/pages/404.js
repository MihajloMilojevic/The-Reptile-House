import { GradientButton, Page, PageTitle } from "../components"
import Link from "next/link"
import Head from 'next/head'

export default function Custom404() {
	return (
		<Page style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		}}>
			<Head>
				<title>404 - Stranica ne postoji | The Reptile House</title>
				<meta 
					name="description" 
					content="Greška 404 - stranica koju tražite ne postoji. Proverite da li ste uneli ispravnu url adresu i pokušajte ponovo." 
				/>
			</Head>
			<div style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}>
				<PageTitle>Stranica koju tražite ne postoji</PageTitle>
				<GradientButton>
					<Link href="/">Vrati se na početnu</Link>
				</GradientButton>
			</div>
		</Page>
	)
}
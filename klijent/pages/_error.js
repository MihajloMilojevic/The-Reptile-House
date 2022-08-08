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
				<title>Greška | The Reptile House</title>
				<meta 
					name="description" 
					content="Došlo je do greške. Pokušajte ponovo kasnije" 
				/>
			</Head>
			<div style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}>
				<PageTitle>Došlo je do greške</PageTitle>
				<GradientButton>
					<Link href="/">Vrati se na početnu</Link>
				</GradientButton>
			</div>
		</Page>
	)
}
import {ProductList, Page, PageTitle} from "../../components"
import Head from 'next/head'


function Terarijumi({data}) {
	return (
		<Page>
			<Head>
				<title>Terarijumi | The Reptile House</title>
				<meta 
					name="description" 
					content="Lista svih terarijuma u ponudi. Kliknite na terarijum koji Vam odgovara da bi pogledali detalje i dodano ga prilagodili Vašim potrebama." 
				/>
			</Head>
			<PageTitle>Terarijumi</PageTitle>
			<ProductList data={data} category="terarijumi"/>
		</Page>
	)
}

export default Terarijumi

export async function getStaticProps() {
	const data = require("../../data/terarijumi.json");
	return {
		props: {
			data,
			revalidate: 60
		}
	}
}
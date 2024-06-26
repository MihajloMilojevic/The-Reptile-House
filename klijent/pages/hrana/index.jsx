import {ProductList, Page, PageTitle} from "../../components"
import Head from 'next/head'
import {svaHrana} from "../../database/hrana";

function Hrana({data}) {
	return (
		<Page>
			<Head>
				<title>Hrana | The Reptile House</title>
				<meta 
					name="description" 
					content="Lista sve hrane u ponudi. Kliknite na hranu koja odgovara Vama i Vašem ljubimcu da bi pogledali detalje ili direkno dadajte u korpu" 
				/>
			</Head>
			<PageTitle>Hrana</PageTitle>
			<ProductList data={data} category="hrana"/>
		</Page>
	)
}


export default Hrana

export async function getStaticProps() {
	const data = await svaHrana();
	return {
		props: {
			data,
		},
		revalidate: 60
	}
}
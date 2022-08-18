import {ProductList, Page, PageTitle} from "../../components"
import Head from 'next/head'
import {svaOprema} from "../../database/oprema";

function Oprema({data}) {
	return (
		<Page>
			<Head>
				<title> | The Reptile House</title>
				<meta 
					name="description" 
					content="Lista sve opreme u ponudi. Kliknite na opremu koja Vam odgovara da bi pogledali detalje ili direkno dadajte u korpu" 
				/>
			</Head>
			<PageTitle>Oprema</PageTitle>
			<ProductList data={data} category="oprema"/>
		</Page>
	)
}

export default Oprema

export async function getStaticProps() {
	const data = await svaOprema()
	return {
		props: {
			data,
		},
		revalidate: 60
	}
}

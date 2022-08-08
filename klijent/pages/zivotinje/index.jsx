import {ProductList, Page, PageTitle} from "../../components"
import Head from 'next/head'

function Zivotinje({data}) {
	return (
		<Page>
			<Head>
				<title>Životinje | The Reptile House</title>
				<meta 
					name="description" 
					content="Listih svih životinja" 
				/>
			</Head>
			<PageTitle>Životinje</PageTitle>
			<ProductList data={data} category="zivotinje"/>
		</Page>
	)
}

export default Zivotinje

export async function getStaticProps() {
	const data = require("../../data/zivotinje.json");
	return {
		props: {
			data,
			revalidate: 60
		}
	}
}
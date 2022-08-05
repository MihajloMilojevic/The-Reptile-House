import {ProductList, Page, PageTitle} from "../../components"

function Hrana({data}) {
	return (
		<Page>
			<PageTitle>Hrana</PageTitle>
			<ProductList data={data} category="hrana"/>
		</Page>
	)
}


export default Hrana

export async function getStaticProps() {
	const data = require("../../data/hrana.json");
	return {
		props: {
			data
		}
	}
}
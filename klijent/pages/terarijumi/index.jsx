import {ProductList, Page, PageTitle} from "../../components"


function Terarijumi({data}) {
	return (
		<Page>
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
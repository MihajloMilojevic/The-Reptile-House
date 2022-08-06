import {ProductList, Page, PageTitle} from "../../components"


function Zivotinje({data}) {
	return (
		<Page>
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
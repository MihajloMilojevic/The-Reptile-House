import {ProductList, Page, PageTitle} from "../../components"

function Oprema({data}) {
	return (
		<Page>
			<PageTitle>Oprema</PageTitle>
			<ProductList data={data} category="oprema"/>
		</Page>
	)
}

export default Oprema

export async function getStaticProps() {
	const data = require("../../data/oprema.json");
	return {
		props: {
			data,
			revalidate: 60
		}
	}
}

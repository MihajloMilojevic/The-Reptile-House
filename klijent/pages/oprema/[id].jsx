import {Page, SingleProductPageContent} from "../../components";

function Oprema(params) {

	return (
		<Page>
			<SingleProductPageContent {...params} />
		</Page>
	)
}

export default Oprema;


export async function getStaticPaths() {
	const data = require("../../data/oprema.json");
	const paths = data.map(item => `/oprema/${item.id}`)
	return {
		paths,
		fallback: "blocking"
	}
}

export async function getStaticProps(context) {
	console.log(context);
	const data = require("../../data/oprema.json");
	const ter = data.find(item => item.id === Number(context.params.id))
	if(!ter)
		return {
			notFound: true
		}
	return {
		props: ter,
		revalidate: 60
	}
}
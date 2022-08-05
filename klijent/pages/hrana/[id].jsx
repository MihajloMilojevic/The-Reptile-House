import {Page, SingleProductPageContent} from "../../components";

function Hrana(params) {

	return (
		<Page>
			<SingleProductPageContent {...params} />
		</Page>
	)
}

export default Hrana;


export async function getStaticPaths() {
	const data = require("../../data/hrana.json");
	const paths = data.map(item => `/hrana/${item.id}`)
	return {
		paths,
		fallback: "blocking"
	}
}

export async function getStaticProps(context) {
	const data = require("../../data/hrana.json");
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
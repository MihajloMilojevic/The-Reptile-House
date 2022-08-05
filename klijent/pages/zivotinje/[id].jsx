import {Page, SingleProductPageContent} from "../../components";

function Zivotinja(params) {

	return (
		<Page>
			<SingleProductPageContent {...params} />
		</Page>
	)
}

export default Zivotinja;


export async function getStaticPaths() {
	const data = require("../../data/zivotinje.json");
	const paths = data.map(item => `/zivotinje/${item.id}`)
	return {
		paths,
		fallback: "blocking"
	}
}

export async function getStaticProps(context) {
	const data = require("../../data/zivotinje.json");
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
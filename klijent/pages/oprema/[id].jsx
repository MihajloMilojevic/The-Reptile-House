import {Page, SingleProductPageContent} from "../../components";
import Head from 'next/head'

function Oprema(params) {

	return (
		<Page>
			<Head>
				<title>{params.naziv} | The Reptile House</title>
				<meta 
					name="description" 
					content={params.opis}
				/>
			</Head>
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
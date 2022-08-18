import {Page, SingleProductPageContent} from "../../components";
import Head from 'next/head'
import {jednaOprema, svaOprema} from "../../database/oprema";

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
	const data = await svaOprema();
	const paths = data.map(item => ({params: {id: item.id}}));
	return {
		paths,
		fallback: "blocking"
	}
}

export async function getStaticProps(context) {
	const opr = await jednaOprema(context.params.id)
	if(!opr)
		return {
			notFound: true
		}
	return {
		props: opr,
		revalidate: 60
	}
}
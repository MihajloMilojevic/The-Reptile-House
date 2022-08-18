import {Page, SingleProductPageContent} from "../../components";
import Head from "next/head";
import {jednaHrana, svaHrana} from "../../database/hrana";

function Hrana(params) {

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

export default Hrana;


export async function getStaticPaths() {
	const data = await svaHrana();
	const paths = data.map(item => ({params: {id: item.id}}));
	return {
		paths,
		fallback: "blocking"
	}
}

export async function getStaticProps(context) {
	const hr = await jednaHrana(context.params.id);
	if(!hr)
		return {
			notFound: true
		}
	return {
		props: hr,
		revalidate: 60
	}
}
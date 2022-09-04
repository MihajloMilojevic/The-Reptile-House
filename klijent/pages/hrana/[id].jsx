import {Page, PageTitle, Slider, Kolicina, GradientButton} from "../../components";
import Head from "next/head";
import {jednaHrana, svaHrana} from "../../database/hrana";
import {useState} from "react";
import {useStateContext} from "../../context/ContextProvider";

function Hrana(params) {

	const [kolicina, setKolicna] = useState(1)
	const {windowSize, dodajUKorpu} = useStateContext()

	function dodaj() {
		const item = {
			naziv: params.naziv,
			id: params.id,
			cena: params.cena,
			thumbnail: params.thumbnail,
			kolicina,
			doplate: []
		}
		dodajUKorpu(item)
	}

	return (
		<Page>
			<Head>
				<title>{params.naziv} | The Reptile House</title>
				<meta 
					name="description" 
					content={params.opis}
				/>
			</Head>
			<div style={{
				display: "flex",
				flexDirection: windowSize.width < 900 ? "column-reverse" : "row",
				gap: "2rem",
				height: "min-content",
				padding: windowSize.width >= 1200 ? "5rem" : windowSize.width >= 900 ? "2rem" : windowSize.width >= 500 ? "1rem" : "0.25rem"
			}}>
				<div style={{flex: 1}}>
					<Slider slides={params.slike}/>
				</div>
				<div 
					style={{
						flex: 1.5, 
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "flex-start",
						gap: "1rem"
					}}
				>
					<div
						style={{
							width: "100%"
						}}
					>
						<PageTitle style={{marginTop: 0, textAlign: "left"}}>{params.naziv}</PageTitle>
						<h3>{params.cena} din.</h3>
						<p>{params.opis}</p>
					</div>
					<div 
						style={{
							display: "flex", 
							alignItems: (windowSize.width <= 500 || (windowSize.width > 900 && windowSize.width <= 1200)) ? "flex-start" : "center", 
							justifyContent: "space-between",
							gap: "1rem",
							width: "100%",
							flexDirection: (windowSize.width <= 500 || (windowSize.width > 900 && windowSize.width <= 1200)) ? "column" : "row"
						}}
					>
						<Kolicina value={kolicina} onChange={setKolicna}/>
						<GradientButton onClick={dodaj}>Dodaj u korpu</GradientButton>
					</div>
				</div>
			</div>
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
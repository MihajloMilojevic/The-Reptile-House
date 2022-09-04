import {Page, PageTitle, Slider, Kolicina, GradientButton, Kvadrat} from "../../components";
import Head from 'next/head'
import {jednaOprema, svaOprema} from "../../database/oprema";
import {useState} from "react";
import {useStateContext} from "../../context/ContextProvider";

function Oprema(params) {

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
						{params.dimenzije && <Dimenzije {...params.dimenzije} />}
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


function Dimenzije({duzina, sirina, visina}) {

	const {windowSize} = useStateContext();

	function Item({text, value}) {
		return (
			<div
				style={{
					display: "flex", 
					justifyContent: "flex-start",
					alignItems: "center",
				}}
			>
				<Kvadrat style={{marginRight: "1rem"}}/>
				<span style={{width: 100}}>{text}</span>
				<span style={{width: 100}}>{value}mm</span>
			</div>
		)
	}

	return (
		<div>
			<p>Dimenzije:</p>
			<div
				style={{
						display: "flex", 
						flexDirection: "column",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						gap: "0.5rem",
						marginLeft: windowSize.width <= 900 ? windowSize.width <= 500 ? "1rem": "1.5rem" : "2rem"
					}}
			>
				{duzina && <Item text="Dužina:" value={duzina} />}	
				{sirina && <Item text="Širina:" value={sirina} />}
				{visina && <Item text="Visina:" value={visina} />}	
			</div>
		</div>
	)
}
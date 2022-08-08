import {Page, PageTitle, Slider, Kolicina, GradientButton, Kvadrat} from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import {useState} from "react"
import Head from 'next/head'

function Item({text, value}) {
	return (
		<div
			style={{
				display: "flex", 
				justifyContent: "flex-start",
				alignItems: "center",
				gap: "1rem",
				paddingLeft: "0.25rem"
			}}
		>
			<Kvadrat style={{minWidth: 10 * Math.sqrt(2), minHeight: 10 * Math.sqrt(2)}}/>
			<div 
				style={{
					display: "flex", 
					gap: "0.5rem",
					justifyContent: "flex-start",
					alignItems: "center",
					flexWrap: "wrap"
				}}
			>
				<span style={{fontWeight: "bold"}}>{text}:</span>
				<span>{value}</span>
			</div>
		</div>
	)
}

const detalji = [
	{
		text: "Vrsta",
		key: "vrsta"
	}, 
	{
		text: "Morf",
		key: "morf"
	}, 
	{
		text: "Pol",
		key: "pol"
	}, 
	{
		text: "Vreme izleganja",
		key: "vreme"
	}, 
	{
		text: "Roditelji",
		key: "roditelji"
	}, 
	{
		text: "Težina",
		key: "tezina"
	}, 
	{
		text: "Vidljiva oštećenja",
		key: "ostecenja"
	}
]

function Zivotinja(params) {

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
					content={detalji.map(item => `${item.text}: ${params[item.key]}`).join("; ")} 
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
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "1.5rem"
							}}
						>
							{
								detalji.map((item, index) => (
									<Item key={index} text={item.text} value={params[item.key]} />
								))
							}
						</div>
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
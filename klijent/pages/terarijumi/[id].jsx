import {Page, Slider, Kolicina, GradientButton, PageTitle, Kvadrat} from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import {useState} from "react";
import {BsCheckLg} from "react-icons/bs";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Head from 'next/head'

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
				<Item text="Dužina:" value={duzina} />	
				<Item text="Širina:" value={sirina} />	
				<Item text="Visina:" value={visina} />	
			</div>
		</div>
	)
}

function Dodaci({dodaci}) {
	
	const {windowSize} = useStateContext();

	return (
		<div>
			<p>Dodaci:</p>
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
				{
					dodaci.map((item, index) => (
						<div
							key={index}
							style={{
								display: "flex",
								justifyContent: "flex-start",
								alignItems: "center",
								gap: "1rem",
							}}
						>
							<Kvadrat />
							<span>{item}</span>
						</div>
					))
				}
			</div>
		</div>
	)
}

function Boje({current, values, onChange}) {
	return (
		
		<>
			<svg width="0" height="0" style={{visibility: "hidden"}}>
			<linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
				<stop stopColor="#0283E9" offset="-18.13%" />
				<stop stopColor="#FC01CA" offset="120.27%" />
			</linearGradient>
		</svg>	
		<div
			style={{
				display: "flex",
				justifyContent: "space-around",
				alignItems: "center",
				gap: "1rem",
				marginBottom: "1rem",
				width: "100%"
			}}
		>
			{
				values.map((boja, index) => (
					<div 
						key={index}
						onClick={() => onChange(index)}
						style={{
							background: boja.hex, 
							borderRadius: "50%",
							width: 40,
							height: 40,
							border: "1px solid black",
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						{ (index === current) && 
							<BsCheckLg size={20} style={{ fill: "url(#blue-gradient)"}} />
						}
					</div>
				))
			}
		</div>
		</>
	)	
}

function Cutomization({bojaValue, bojaChange, natpisValue, natpisChange, doplateCene}) {

	const {windowSize} = useStateContext();

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: ((windowSize.width <= 1000 && windowSize.width >= 900) || windowSize.width <= 400) ? "flex-start" : "center",
					gap: ((windowSize.width <= 1000 && windowSize.width >= 900) || windowSize.width <= 400) ? "1rem" : "2rem",
					margin: "1rem",
					flexDirection: ((windowSize.width <= 1000 && windowSize.width >= 900) || windowSize.width <= 400) ? "column" : "row"
				}}
			>
				<FormControlLabel
					control={
						<Switch
							checked={bojaValue.checked}
							onChange={e => bojaChange({...bojaValue, checked: e.target.checked})}
							color="secondary"
						/>
					}
					label={`Prilagodjena boja - ${doplateCene.boja}din.`}
					labelPlacement="end"
				/>
				{bojaValue.checked && 
					<div style={
						((windowSize.width <= 1000 && windowSize.width >= 900) || windowSize.width <= 400) ? 
						{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							margin: 0
						} : 
						{}
					}>
						<input 
							type={"color"} 
							value={bojaValue.hex} 
							onChange={e => bojaChange({...bojaValue, hex: e.target.value})}
						/>
					</div>
				}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-start",
					alignItems: ((windowSize.width <= 1300 && windowSize.width >= 900) || windowSize.width <= 700) ? "flex-start" : "center",
					gap: ((windowSize.width <= 1300 && windowSize.width >= 900) || windowSize.width <= 700) ? "1rem" : "2rem",
					margin: "1rem",
					flexDirection: ((windowSize.width <= 1300 && windowSize.width >= 900) || windowSize.width <= 700) ? "column" : "row"
				}}
			>
				<FormControlLabel
					control={
						<Switch
							checked={natpisValue.checked}
							onChange={e => natpisChange({...natpisValue, checked: e.target.checked})}
							color="secondary"
						/>
					}
					label={`Prilagodjen natpis - ${doplateCene.natpis}din.`}
					labelPlacement="end"
					style={{minWidth: "fit-content"}}
				/>
				{natpisValue.checked && 
					<input 
						type={"text"} 
						value={natpisValue.natpis} 
						onChange={e => natpisChange({...natpisValue, natpis: e.target.value})}
						style={{
							width: "100%",
							outline: "none",
							border: "1px solid black",
							borderRadius: 15,
							padding: "1rem 1rem"
						}}
					/>
				}
			</div>
		</div>
	)
}

function Terarijum(params) {
	const [kolicina, setKolicna] = useState(1)
	const [bojaIndex, setBojaIndex] = useState(0)
	const [customNatpis, setCustomNatpis] = useState({
		natpis: "The reptile house",
		checked: false
	})
	const [customBoja, setCustomBoja] = useState({
		hex: "#000000",
		checked: false
	})
	const {windowSize, dodajUKorpu} = useStateContext()

	function dodajClick() {
		const item = {
			naziv: params.naziv,
			id: params.id,
			cena: params.cena,
			thumbnail: params.thumbnail,
			kolicina,
			boja: customBoja.checked ? customBoja : params.boje[bojaIndex],
			...(customNatpis.checked ? {natpis: customNatpis.natpis} : {}),
			doplate: [
				...(customBoja.checked ? [{za: "Prilagodjena boja", vrednost: params.doplate.boja}] : []),
				...(customNatpis.checked ? [{za: "Prilagodjen natpis", vrednost: params.doplate.natpis}] : []),
			]
		}
		dodajUKorpu(item)
	}

	return (
		<Page>
		<div style={{
			display: "flex",
			flexDirection: windowSize.width < 900 ? "column-reverse" : "row",
			gap: "2rem",
			height: "min-content",
			padding: windowSize.width <= 900 ? windowSize.width <= 500 ? "1rem" : "2rem" : ".25rem"
		}}>
			<Head>
				<title>{params.naziv} | The Reptile House</title>
				<meta 
					name="description" 
					content={params.opis} 
				/>
			</Head>
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
					
					<Dimenzije 
						duzina={params.dimenzije.duzina}
						sirina={params.dimenzije.sirina}
						visina={params.dimenzije.visina}
					/> 

					<Dodaci dodaci={params.dodaci} />
					
				
					<Boje 
							current={customBoja.checked ? -1 : bojaIndex}
							onChange={(index) => {setBojaIndex(index); setCustomBoja({...customBoja, checked: false})}}
							values={params.boje}
					/>

					<Cutomization 
						bojaValue={customBoja}
						bojaChange={setCustomBoja}
						natpisValue={customNatpis}
						natpisChange={setCustomNatpis}
						doplateCene={params.doplate}
					/>

					<div 
						style={{
							display: "flex", 
							alignItems: (windowSize.width <= 500 || (windowSize.width > 900 && windowSize.width <= 1050)) ? "flex-start" : "center", 
							justifyContent: "space-between",
							gap: "1rem",
							width: "100%",
							flexDirection: (windowSize.width <= 500 || (windowSize.width > 900 && windowSize.width <= 1050)) ? "column" : "row"
						}}
					>
						<Kolicina value={kolicina} onChange={setKolicna}/>
						<GradientButton onClick={dodajClick}>Dodaj u korpu</GradientButton>
					</div>
				
				</div>
			</div>
		</div>
		</Page>
	)
}

export default Terarijum;


export async function getStaticPaths() {
	const data = require("../../data/terarijumi.json");
	const paths = data.map(item => `/terarijumi/${item.id}`)
	return {
		paths,
		fallback: "blocking"
	}
}

export async function getStaticProps(context) {
	const data = require("../../data/terarijumi.json");
	const doplate = require("../../data/doplate.json");
	// const doplate = {
	// 	"boja": 1500,
	// 	"natpis": 2000
	// }
	const terarijum = data.find(item => item.id === Number(context.params.id))
	if(!terarijum)
		return {
			notFound: true
		}
	return {
		props: {
			...terarijum,
			doplate
		},
		revalidate: 60
	}
}
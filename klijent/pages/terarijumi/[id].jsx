import {Page, Slider, Kolicina, GradientButton, PageTitle} from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import {useState} from "react";
import {BsCheckLg} from "react-icons/bs";

function Kvadrat({style}) {
	return (
		<div 
			style={{
				width: "10px",
				height: "10px",
				transform: "rotate(45deg)",
				background: "linear-gradient(238.66deg, #0283E9 -18.13%, #FC01CA 120.27%)",
				...style
			}}
		/>
	)
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
				margin: "1rem"
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
							width: "50px",
							height: "50px",
							border: "1px solid black",
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						{ (console.log(index, index === current, current) || (index === current)) && 
							<BsCheckLg size={25} style={{ fill: "url(#blue-gradient)"}} />
						}
					</div>
				))
			}
		</div>
		</>
	)	
}

function Terarijum(params) {
	const [kolicina, setKolicna] = useState(1)
	const [bojaIndex, setBojaIndex] = useState(0)
	const {windowSize, dodajUKorpu} = useStateContext()

	return (
		<Page>
		<div style={{
			display: "flex",
			flexDirection: windowSize.width < 900 ? "column-reverse" : "row",
			gap: "2rem",
			height: "min-content",
			padding: windowSize.width <= 900 ? windowSize.width <= 500 ? "1rem" : "2rem" : ".25rem"
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
					
					<Dimenzije 
						duzina={params.dimenzije.duzina}
						sirina={params.dimenzije.sirina}
						visina={params.dimenzije.visina}
					/> 

					<Dodaci dodaci={params.dodaci} />

					<Boje 
						current={bojaIndex}
						onChange={setBojaIndex}
						values={params.boje}
					/>
					
				</div>
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
					<GradientButton onClick={() => dodajUKorpu({...params, kolicina, boja: params.boje[bojaIndex]})}>Dodaj u korpu</GradientButton>
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





					


// <div style={{
// 				display: "flex",
// 				flexDirection: windowSize.width < 900 ? "column" : "row",
// 				gap: "2rem",
// 				padding: "2rem 3rem",
// 				height: "min-content"
// 			}}>
// 				<div style={{flex: 1, width: 500}}>
// 					<Slider slides={params.slike} style={{maxWidth: 500}} imgSize={500}/>
// 				</div>
// 				<div style={{flex: 1.5}}>
// 					<h1>{params.naziv}</h1>
// 					<h3>{params.cena}</h3>
// 					<p>{params.opis}</p>
// 					<p>Dimenzije:</p>
// 					<ul>
// 						<li>Dužina: {params.dimenzije.duzina}</li>
// 						<li>Širina: {params.dimenzije.sirina}</li>
// 						<li>Visina: {params.dimenzije.visina}</li>
// 					</ul>
// 					<p>Dodaci:</p>
// 					<ul>
// 						{
// 							params.dodaci.map((item, index) => (<li key={index}>{item}</li>))
// 						}
// 					</ul>
// 					<div 
// 						style={{
// 							display: "flex",
// 							width: "100%",
// 							justifyContent: "space-around"
// 						}}
// 					>
// 						{
// 							params.boje.map((boja, index) => (
								// <div
								// 	key={index}
								// 	style={{
								// 		display: "flex",
								// 		gap: "1rem"
								// 	}}
								// >
								// 	<div style={{
								// 		background: boja.hex, 
								// 		borderRadius: "50%",
								// 		width: "50px",
								// 		height: "50px",
								// 		border: "1px solid black"
								// 	}} />
								// 	<p>{boja.text}</p>
								// </div>
// 							))
// 						}
// 					</div>
// 					<p>Doplate:</p>
// 					<ul>
// 						{
// 							params.doplate.map((item, index) => (
// 								<li key={index}>{item.text} - {item.cena}</li>
// 							))
// 						}
// 					</ul>
// 					<div 
// 						style={{
// 							display: "flex", 
// 							alignItems: (windowSize.width <= 500 || (windowSize.width > 900 && windowSize.width <= 1050)) ? "flex-start" : "center", 
// 							justifyContent: "space-between",
// 							gap: "1rem",
// 							width: "100%",
// 							flexDirection: (windowSize.width <= 500 || (windowSize.width > 900 && windowSize.width <= 1050)) ? "column" : "row"
// 						}}
// 					>
// 						<Kolicina value={kolicina} onChange={setKolicna}/>
// 						<GradientButton onClick={() => dodajUKorpu({...params, kolicina})}>Dodaj u korpu</GradientButton>
// 					</div>
// 				</div>
// 			</div>
import {PageTitle, Slider, Kolicina, GradientButton} from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import {useState} from "react"

function SingleProductPageContent(params) {

	const [kolicina, setKolicna] = useState(1)
	const {windowSize, dodajUKorpu} = useStateContext()

	return (
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
					<GradientButton onClick={() => dodajUKorpu({...params, kolicina})}>Dodaj u korpu</GradientButton>
				</div>
			</div>
		</div>
	)
}

export default SingleProductPageContent
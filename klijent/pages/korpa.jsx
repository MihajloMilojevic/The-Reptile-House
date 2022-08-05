import {useStateContext} from "../context/ContextProvider";

function Korpa() {
	const {windowSize, korpa, izbaciIzKorpe, promeniKolicinu, ukupnaCenaKorpe} = useStateContext()
	
	return (
		<div>
		{
			korpa.map((props, index) => {
				console.log(props)
				return (
				<div 
					key={index}
					style={{
						display: "flex",
						flexDirection: windowSize.width < 900 ? "column" : "row",
						gap: "2rem",
						padding: "2rem",
						margin: "1rem 3rem",
						boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.25)",
						borderRadius: "10px"
					}}
				>
					<div 
						style={{
							flex: 1,
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						<img 
							src={props.tumbnail} 
							alt={props.naziv}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "contain"
							}}
						/>
					</div>
					<div
						style={{
							flex: 1.5
						}}
					>
						<p>Naziv: {props.naziv}</p>
						<p>Cena po komadu: {props.cena}</p>
						<p>Količina: <input type="number" min={1} value={props.kolicina} onChange={e => promeniKolicinu(index, e.target.value)}/></p>
						{props?.boja && <p>Boja: {props.boja.naziv}</p>}
						<p>Ukupna cena: {props.kolicina * props.cena}</p>
						<button type="button" onClick={() => izbaciIzKorpe(index)}>Izbaci</button>
					</div>
				</div>
			)})
		}
		<p>Ukupna cena: {ukupnaCenaKorpe}</p>
		</div>
	)
}

export default Korpa
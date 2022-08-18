import {useStateContext} from "../context/ContextProvider";
import {Page, PageTitle, GradientButton} from "../components";
import { useEffect, useState } from "react";
import {AiOutlineClose} from "react-icons/ai";
import Head from 'next/head'

function KorpaItem(props) {
	
	const {windowSize, izbaciIzKorpe} = useStateContext()
	return (
		<div 
			style={{
				display: "flex",
				flexDirection: windowSize.width <= 600 ? "column" : "row",
				paddingLeft: windowSize.width <= 500 ? "2rem" : "4rem",
				paddingRight: windowSize.width <= 500 ? "2rem" : "4rem",
				paddingBottom: windowSize.width <= 500 ? "2rem" : "4rem",
				paddingTop: "4rem",
				boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.25)",
				borderRadius: "10px",
				gap: "2rem",
				width: windowSize.width <= 900 ? "100%" : (windowSize.width <= 1400 ? "75%" : "50%"),
				background: "white",
				position: "relative"
			}}
		>
			<GradientButton 
				style={{
					borderRadius: "50%",
					width: 40,
					height: 40,
					padding: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					position: "absolute",
					top: "1.5rem",
					right: "1.5rem"
				}} 
				onClick={
					() => izbaciIzKorpe(props.index)
				}
			>
				<AiOutlineClose color="white" size={25} />
			</GradientButton>
			<div 
				style={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						maxWidth: 300,
						maxHeight: 300,
						minWidth: 150,
						minHeight: 150,
						overflow: "hidden",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<img 
						src={props.thumbnail} 
						alt={props.naziv}
						style={{
							objectFit: "contain",
							height: "100%",
							width: "100%",
						}}
					/>
				</div>
			</div>
			<div
				style={{
					flex: 1.5
				}}
			>
				<div style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center"
				}}>
					<h3>{props.naziv}</h3>
					{props?.boja && <div style={{width: 25, height: 25, border: "1px solid black", borderRadius: "50%", background: props.boja.hex}}/>}
				</div>
				<p>Količina: {props.kolicina}</p>
				<p>Cena po komadu: {props.cena}din.</p>
				{
					props.doplate.map((item, index) => (<p key={index}>{item.za}: {item.vrednost}din.</p>))
				}
				{props.natpis && <p>Natpis: "{props.natpis}"</p>}
				<p>Ukupna cena: {props.kolicina * (props.cena + props.doplate.reduce((prev, curr) => (prev + curr.vrednost), 0))} din.</p>
			</div>
		</div>
	)
}

function FormItem({value, onChange, name}) {
	const {windowSize} = useStateContext();
	const labelStyle = {
		fontStyle: "italic",
		marginLeft: "0.5rem",
		flex: 1
	}
	const inputStyle = {
		outline: "none",
		border: "none",
		fontSize: 16,
		padding: "0.5rem",
		marginTop: "0.5rem",
		width: "100%",
		borderBottom: "1px dashed black",
	}
	const errorMessageStyle = {
		color: "red",
		flex: 1,
		textAlign: windowSize.width <= 700 ? "left" : "right",
		padding: 0,
		margin: 0,
		marginLeft: "0.5rem",
		fontSize: windowSize.width <= 700 ? 12 : 14
	}
	return (
		<div style={{width: "100%"}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					gap: "0.25rem",
					flexDirection: windowSize.width <= 700 ? "column-reverse" : "row"
				}}
			>
				<label style={labelStyle} htmlFor={name.toLowerCase()}>{name} *</label>
				{value.error && (<p style={errorMessageStyle}>{value.error}</p>)}
			</div>
			<input style={inputStyle} value={value.value} onChange={onChange} name={name.toLowerCase()} placeholder={name} id={name.toLowerCase()}/>
		</div>
	)
}

const initialFormData = {
	ime: {
		error: "",
		value: ""
	},
	prezime: {
		error: "",
		value: ""
	},
	telefon: {
		error: "",
		value: ""
	},
	mejl: {
		error: "",
		value: ""
	},
	adresa: {
		error: "",
		value: ""
	}
}

function Korpa() {
	const {korpa, ukupnaCenaKorpe, windowSize, setLoader, isprazniKorpu, createNotification, notificationTypes} = useStateContext()
	const [showForm, setShowForm] = useState(false)
	const [formData, setFormData] = useState(initialFormData)

	useEffect(() => {
		if(korpa.length === 0)
			setShowForm(false);
	}, [korpa])

	function formDataChange(e) {
		setFormData({...formData, [e.target.name]: {...formData[e.target.name], value: e.target.value}})
	}

	async function handleFormSubmit(e) {
		e.preventDefault();

		let hasError = false;
		let formDataCopy = {...formData};
		if(!formDataCopy.ime.value) {
			formDataCopy.ime.error = "Morate uneti ime."
			hasError = true;
		}
		else if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/.test(formDataCopy.ime.value)) {
			formDataCopy.ime.error = "Ime ne sme sadržati specijalne karaktere"
			hasError = true;
		}
		else {
			formDataCopy.ime.error = ""
		}

		if(!formDataCopy.prezime.value) {
			formDataCopy.prezime.error = "Morate uneti prezime."
			hasError = true;
		}
		else if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]+/.test(formDataCopy.prezime.value)) {
			formDataCopy.prezime.error = "Prezime ne sme sadržati specijalne karaktere"
			hasError = true;
		}
		else {
			formDataCopy.prezime.error = ""
		}

		if(!formDataCopy.telefon.value) {
			formDataCopy.telefon.error = "Morate uneti telefon."
			hasError = true;
		}
		else if(!/^[0-9]+$/.test(formDataCopy.telefon.value)) {
			formDataCopy.telefon.error = "Telefon može sadržati samo brojeve"
			hasError = true;
		}
		else if(formDataCopy.telefon.value.length <6 ) {
			formDataCopy.telefon.error = "Nedovoljno cifara";
			hasError = true;
		}
		else {
			formDataCopy.telefon.error = ""
		}

		if(!formDataCopy.mejl.value) {
			formDataCopy.mejl.error = "Morate uneti mejl."
			hasError = true;
		}
		else if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(formDataCopy.mejl.value)) {
			formDataCopy.mejl.error = "Neispravan format mejl adrese"
			hasError = true;
		}
		else {
			formDataCopy.mejl.error = ""
		}

		if(!formDataCopy.adresa.value) {
			formDataCopy.adresa.error = "Morate uneti adresu."
			hasError = true;
		}
		else {
			formDataCopy.adresa.error = ""
		}
		
		if(hasError) {
			setFormData(formDataCopy);
			return;
		}

		try {
			setLoader(true);
			const data = await fetch("/api/porudzbine", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					proizvodi: korpa.map(item => ({
						proizvod_id: item.id,
						kolicina: item.kolicina,
						boja: item?.boja?.hex ?? "",
						natpis: item?.natpis ?? ""
					})),
					ime: formData.ime.value,
					prezime: formData.prezime.value,
					mejl: formData.mejl.value,
					adresa: formData.adresa.value,
					telefon: formData.telefon.value
				})
			})
			const json = await data.json();
			if(!json.ok)
				throw json.error;
			isprazniKorpu();
			setFormData(initialFormData);
			createNotification({
				type: notificationTypes.SUCCESS,
				title: "Uspešna porudžbina",
				message: "Vaša porudžbina je uspešno zabeležena. Neko će Vam se uskoro javiti oko detalja isporuke. Hvala",
				timeout: 10 * 1000
			})
		} catch (error) {
			console.error(error);
			createNotification({
				type: notificationTypes.ERROR,
				title: "Greška",
				message: "Došlo je do greške. Probajte ponovo kasnije."
			})
		}
		finally {
			setShowForm(false);
			setLoader(false);
		}
	}
	
	return (
		<Page style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			alignItems: "center",
			gap: "2rem",
		}}>
			<Head>
				<title>Kopra | The Reptile House</title>
				<meta 
					name="description" 
					content="Pogledajte stvari koje ste dodali u korpu, popunite formular i poručite sve što vam treba za Vašeg ljubimca." 
				/>
			</Head>
			<PageTitle style={{flex: 1}}>Korpa</PageTitle>
			<div 
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					gap: "2rem",
					width: "100%"
				}}
			>
			{
				korpa.length > 0 ?
					(korpa.map((props, index) => (<KorpaItem key={index} {...props} index={index}/>))) :
					<p>Korpa je prazna.</p>
			}
			</div>
			<div style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				alignItems: "center",
				flex: 1
			}}>
				<div>
					<p style={{fontSize: 16, fontWeight: "bolder", margin: "0.5rem", textAlign: "center"}}>Ukupna cena: </p>
					<h3 style={{margin: 0, textAlign: "center", fontSize: 24}}>{ukupnaCenaKorpe} din.</h3>
					{
						(korpa.length > 0 && !showForm) && 
						(<GradientButton style={{width: "100%"}} onClick={() => setShowForm(true)}>Naruči</GradientButton>)
					}
				</div>
			</div>
			{
				showForm &&
				(
					<div
						style={{
							width: windowSize.width <= 700 ? "100%" : "50%",
							background: "white",
							borderRadius: 15,
							boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.25)",
							padding: "2rem"
						}}
					>
						<form 
							onSubmit={handleFormSubmit}
							style={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
								alignItems: "center",
								gap: "1rem",
								width: "100%"
							}}
						>
							{
								["Ime", "Prezime", "Mejl", "Telefon", "Adresa"].map((item, index) => (
									<FormItem 
										key={index}
										onChange={formDataChange}
										name={item}
										value={formData[item.toLowerCase()]}
									/>
								))
							}
							<div style={{width: "100%"}}>
								<GradientButton type="submit">Naruči</GradientButton>
							</div>
						</form>
					</div>
				)
			}
		</Page>
	)
}

export default Korpa
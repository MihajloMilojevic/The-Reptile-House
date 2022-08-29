/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react'
import { PageTitle, Kvadrat, GradientButton, OnDoubleClickInput } from '../../components'
import { useStateContext } from '../../context/ContextProvider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {AiOutlineClose} from "react-icons/ai";

const IMAGE_HOST = "https://thereptilehouse.rs";
// const IMAGE_HOST = "http://localhost:10000"

const statusi = [
	{
		id: 1,
		naziv: "neobradjeno"
	},
	{
		id: 2,
		naziv: "obradjeno"
	},
	{
		id: 3,
		naziv: "poslato"
	},
	{
		id: 4,
		naziv: "primljeno"
	},
	{
		id: 5,
		naziv: "vraćeno"
	},
]

const keys = [
	{
		field: "id",
		headerName: "Id",
	},
	{
		field: "ime",
		headerName: "Ime",
	},
	{
		field: "prezime",
		headerName: "Prezime",
	},
	{
		field: "mejl",
		headerName: "Mejl",
	},
	{
		field: "telefon",
		headerName: "Telefon",
	},
	{
		field: "adresa",
		headerName: "Adresa",
	},
	{
		field: "datum",
		headerName: "Datum",
		valueGetter: (value) => {
			const d = new Date(value);
			return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}. ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
		},
	},
	{
		field: "cena",
		headerName: "Ukupna cena",
		valueGetter: (value) => (`${value} din.`)
	}
]

function Porudzbina() {

	const router = useRouter();
	const [data, setData] = useState(null);
	const {setLoader, createNotification, notificationTypes, windowSize} = useStateContext();

	async function promeniStatus(status) {
		try {
			setLoader(true);
			const res = await fetch(`/api/porudzbine/${router.query.id}/statusi`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({status})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setData({...data, status});
				setLoader(false);
				createNotification({
					type: notificationTypes.SUCCESS,
					message: `Status uspešno promenjen u '${status}'`
				});
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				});
			}, 1 * 1000);
		}
	}
	async function promeniIdPosiljke(id) {
		try {
			setLoader(true);
			const res = await fetch(`/api/porudzbine/${router.query.id}/posiljke`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({id})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setData({...data, posiljka_id: id});
				setLoader(false);
				createNotification({
					type: notificationTypes.SUCCESS,
					message: `Id pošiljke uspešno promenjen u '${id}'`
				});
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				});
			}, 1 * 1000);
		}
	}

	const fetchData = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch(`/api/porudzbine/${router.query.id}`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setData(json.data);
				setLoader(false);
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				});
				router.push("/porudzbine");
			}, 1 * 1000);
		}
	}, [])

	useEffect(() => {
		fetchData();
	}, [])

  	return (
		<div style={{position: "relative"}}>
			<PageTitle>Porudžbina {data ? `#${data.id}` : ""}</PageTitle>
			{data && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "fex-sltart",
						gap: "0.75rem",
					}}
				>
					{
						keys.map(key => (
							<div 
								key={key.field} 
								style={{
									flex: 1,
									width: "100%",
									display: "flex",
									alignItems: windowSize.width <= 600 ? "flex-start" : "center",
									justifyContent: "flex-start",
									gap: "0.75rem",
									flexDirection: windowSize.width <= 600 ? "column" : "row"
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "flex-start",
										justifyContent: "flex-start",
										gap: "0.75rem",
									}}
								>
									<Kvadrat />
									<span>{key.headerName}: </span>
								</div>
								<b style={{wordWrap: " break-word", wordBreak: "break-all", ...(windowSize.width <= 600 ? {marginInline: "2rem"} : {})}}>{key.hasOwnProperty("valueGetter") ? key.valueGetter(data[key.field]) : data[key.field]}</b>
							</div>
						))
					}
					<div 
						style={{
							flex: 1,
							width: "100%",
							display: "flex",
							alignItems: windowSize.width <= 600 ? "flex-start" : "center",
							justifyContent: "flex-start",
							gap: "0.75rem",
							flexDirection: windowSize.width <= 600 ? "column" : "row"
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "flex-start",
								justifyContent: "flex-start",
								gap: "0.75rem",
							}}
						>
							<Kvadrat />
							<span>Id pošiljke: </span>
						</div>
						<OnDoubleClickInput style={{...(windowSize.width <= 600 ? {marginInline: "2rem"} : {}), flex: 1, width: "100%"}} value={data?.posiljka_id ?? "/"} onConfirm={promeniIdPosiljke} />
					</div>
				</div>
			)}
			{data && (
				<FormControl 
					sx={{
						zIndex: 999999999,
						width: windowSize.width <= 500 ? "70%" : 300,
						margin: windowSize.width <= 500 ? "0.5rem" : "2rem",
						marginTop: "2rem"
					}}
				>
					<InputLabel id="status-label">Status</InputLabel>
					<Select
						labelId="status-label"
						value={data.status ?? statusi[0].naziv}
						label="Status"
						onChange={e => promeniStatus(e.target.value)}
						sx={{ backgroundColor: "white" }}
						MenuProps={{
							style: {zIndex: 999999999}
						}}
					>
						{
							statusi.map(status => (
								<MenuItem style={{zIndex: 99999999}} key={status.id} value={status.naziv}>{status.naziv}</MenuItem>
							))
						}
					</Select>
				</FormControl>
			)}
			{data && (
				<div>
					<PageTitle level={3} style={{textAlign: "left", fontSize: 28, marginInline: windowSize.width <= 500 ? "0.5rem" : "2rem"}}>Proizvodi</PageTitle>
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
						data.proizvodi.map((proizvod, index) => (
							<Proizvod key={index} {...proizvod}/>
						))
					}
					</div>
				</div>
			)}
		</div>
  	)
}

export default Porudzbina


function Proizvod(props) {
	
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
				position: "relative",
				marginInline: windowSize.width <= 500 ? "0.5rem" : "2rem"
			}}
		>
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
						src={`${IMAGE_HOST}${props.thumbnail}`} 
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
					{props?.boja && <div style={{width: 25, height: 25, border: "1px solid black", borderRadius: "50%", background: props.boja}}/>}
				</div>
				<p>Količina: {props.kolicina}</p>
				{props.boja && <p>Boja hex: {'"'}{props.boja}{'"'}</p>}
				{props.natpis && <p>Natpis: {'"'}{props.natpis}{'"'}</p>}
				<p>Cena: {props.cena} din.</p>
			</div>
		</div>
	)
}
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react'
import { PageTitle } from '../../components'
import { useStateContext } from '../../context/ContextProvider';
import { useRouter } from 'next/router';

function Porudzbine() {

	const router = useRouter();
	const [porudzbine, setPorudzbine] = useState([]);
	const [statusi, setStatusi] = useState([]);
	const {setLoader, createNotification, notificationTypes} = useStateContext();

	
	const fetchPorudzbine = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch("/api/porudzbine");
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setPorudzbine(json.data);
				setLoader(false);
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				});
				router.push("/");
			}, 1 * 1000);
		}
	}, [])
	
	useEffect(() => {
		fetchPorudzbine();
	}, [])


	const columnSettings = {
		hideable: false,
		sortable: false,
		disableColumnMenu: true,
		minWidth: 200,
		maxWidth: 1000
		// flex: 1
	}

	const columns = [
		{
			//   "status": "neobradjeno",
			field: "status",
			headerName: "Status",
			...columnSettings
		},
		{
			// 	"id": "8cba4b20a67af4477145",
			field: "id",
			headerName: "Id",
			...columnSettings
		},
		{
			//   "ime": "Mihajlo",
			field: "ime",
			headerName: "Ime",
			...columnSettings
		},
		{
			//   "prezime": "Milojević",x
			field: "prezime",
			headerName: "Prezime",
			...columnSettings
		},
		{
			//   "mejl": "milojevicm374@gmail.com",
			field: "mejl",
			headerName: "Mejl",
			...columnSettings
		},
		{
			//   "telefon": "0649781191",
			field: "telefon",
			headerName: "Telefon",
			...columnSettings
		},
		{
			//   "adresa": "8. mart 70",
			field: "adresa",
			headerName: "Adresa",
			...columnSettings
		},
		{
			//   "datum": "2022-08-24 16:33:34",
			field: "datum",
			valueGetter: ({ value }) => {
				const d = new Date(value);
				return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}. ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
			},
			headerName: "Datum",
			...columnSettings
		},
		{
			//   "cena": "56350",
			field: "cena",
			headerName: "Ukupna cena",
			...columnSettings
		},
		{
			//   "posiljka_id": null,
			field: "posiljka_id",
			headerName: "Id pošiljke",
			valueGetter: ({ value }) => (value ?? "/"),
			...columnSettings
		},
	]

	return (
		<div style={{minHeight: "75vh", display: "flex", flexDirection: "column"}}>
			<Head>
				<title>Porudžbine | The Reptile House</title>
				<meta
					name="description"
					content="Stranica sa svim porudžbinama"
				/>
			</Head>
			<PageTitle>Porudžbine</PageTitle>
			<div style={{ flex: 1, display: 'flex', height: '100%', minHeight: "100%" }}>
				<DataGrid
					sx={{background: "white"}}
					autoHeight
					hideFooter
					disableColumnFilter
					disableColumnSelector
					disableColumnMenu
					disableSelectionOnClick
					density="standard"
					columns={columns}
					rows={porudzbine}
					onRowClick={(params) => router.push(`/porudzbine/${params.row.id}`)}
				/>
			</div>
			
		</div>
	)
}

export default Porudzbine
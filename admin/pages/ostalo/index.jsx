/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react'
import { PageTitle, Kvadrat, GradientButton, OnDoubleClickInput } from '../../components'
import { useStateContext } from '../../context/ContextProvider';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import {AiOutlineClose} from "react-icons/ai";

const IMAGE_HOST = "https://thereptilehouse.rs";
// const IMAGE_HOST = "http://localhost:10000"

function Ostalo() {

	const router = useRouter();
	const [doplate, setDoplate] = useState(null);
	const [dodaci, setDodaci] = useState(null);
	const [boje, setBoje] = useState(null);
	const [slike, setSlike] = useState(null);
	const {setLoader, createNotification, notificationTypes, windowSize, openDeleteDialog} = useStateContext();

	function handleDeleteImage(src) {
		openDeleteDialog({
			naziv: src,
			onYes: () => obrisiSliku(src)
		})
	}

	function handleDeleteDodatak(naziv) {
		openDeleteDialog({
			naziv,
			onYes: () => obrisiDodatak(naziv)
		})
	}

	function handleDeleteBoje(hex) {
		openDeleteDialog({
			naziv: hex,
			onYes: () => obrisiBoju(hex)
		})
	}

	async function obrisiSliku(src) {
		try {
			setLoader(true);
			const body = new FormData();
			body.append("src", src);
			const res = await fetch(`${IMAGE_HOST}/api/images`, {
				method: "DELETE",
				body
				// headers: {
				// 	"Content-Type": "application/json",
				// },
				// body: JSON.stringify({src})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchSlike();
			createNotification({
				type: notificationTypes.SUCCESS,
				message: `Slika uspešno obrisana`
			});
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

	async function obrisiDodatak(naziv) {
		try {
			setLoader(true);
			const res = await fetch(`/api/dodaci`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({naziv})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchDodatke();
			createNotification({
				type: notificationTypes.SUCCESS,
				message: `Dodatak uspešno obrisan`
			});
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

	async function obrisiBoju(hex) {
		try {
			setLoader(true);
			const res = await fetch(`/api/boje`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({hex})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchBoje();
			createNotification({
				type: notificationTypes.SUCCESS,
				message: `Boja uspešno obrisana`
			});
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

	async function promeniDodatak(stariNaziv, noviNaziv) {
		try {
			setLoader(true);
			const res = await fetch(`/api/dodaci`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({stariNaziv, noviNaziv})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchDodatke();
			createNotification({
				type: notificationTypes.SUCCESS,
				message: `Naziv uspešno promenjena u '${noviNaziv}'`
			});
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

	async function promeniDoplatu(naziv, cena) {
		try {
			setLoader(true);
			const res = await fetch(`/api/doplate`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({naziv, cena})
			});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchDoplate();
			createNotification({
				type: notificationTypes.SUCCESS,
				message: `Cena uspešno promenjena u '${cena}'`
			});
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

	const fetchDoplate = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch(`/api/doplate`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setDoplate(json.data);
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

	const fetchDodatke = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch(`/api/dodaci`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setDodaci(json.data);
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

	const fetchBoje = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch(`/api/boje`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setBoje(json.data);
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

	const fetchSlike = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch(`/api/slike`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setSlike(json.data);
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
		fetchDoplate();
		fetchDodatke();
		fetchBoje();
		fetchSlike();
	}, [])

  	return (
		<div style={{position: "relative"}}>
			<PageTitle>Ostalo</PageTitle>
			{doplate && (
				<div style={{marginBottom: "2rem"}}>
					<PageTitle level={3} style={{textAlign: "left", fontSize: 28, marginInline: windowSize.width <= 600 ? "0.5rem" : "2rem"}}>Doplate</PageTitle>
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: windowSize.width <= 600 ? "flex-start" : "center",
							justifyContent: "flex-start",
							gap: "1rem",
							paddingInline: windowSize.width <= 600 ? "0.5rem" : "4rem"
						}}
					>
						<div 
							style={{
								flex: 1,
								width: "100%",
								display: "flex",
								alignItems: windowSize.width <= 600 ? "flex-start" : "center",
								justifyContent: "flex-start",
								gap: "0.75rem",
								flexDirection: windowSize.width <= 600 ? "column" : "row",
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
								<span>Boja: </span>
							</div>
							<OnDoubleClickInput style={{...(windowSize.width <= 600 ? {marginInline: "2rem"} : {})}} value={doplate?.boja} onConfirm={(value) => promeniDoplatu("boja", value)} />
						</div>
						<div 
							style={{
								flex: 1,
								width: "100%",
								display: "flex",
								alignItems: windowSize.width <= 600 ? "flex-start" : "center",
								justifyContent: "flex-start",
								gap: "0.75rem",
								flexDirection: windowSize.width <= 600 ? "column" : "row",
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
								<span>Natpis: </span>
							</div>
							<OnDoubleClickInput style={{...(windowSize.width <= 600 ? {marginInline: "2rem"} : {})}} value={doplate?.natpis} onConfirm={(value) => promeniDoplatu("natpis", value)} />
						</div>
					</div>
				</div>
			)}
			{dodaci && (
				<div style={{marginBottom: "2rem"}}>
					<PageTitle level={3} style={{textAlign: "left", fontSize: 28, marginInline: windowSize.width <= 600 ? "0.5rem" : "2rem"}}>Dodaci</PageTitle>
					<div
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: windowSize.width <= 600 ? "flex-start" : "center",
							justifyContent: "flex-start",
							gap: "1rem",
							paddingInline: windowSize.width <= 600 ? "0.5rem" : "4rem"
						}}
					>
						{
							dodaci.length > 0 ? (
								dodaci.map((dodatak, index) => (
									<div 
										key={index}
										style={{
											flex: 1,
											width: "100%",
											display: "flex",
											alignItems: windowSize.width <= 600 ? "flex-start" : "center",
											justifyContent: "flex-start",
											gap: "0.75rem",
											flexDirection: windowSize.width <= 600 ? "column" : "row",
										}}
									>
										<Kvadrat />
										<div
											style={{
												flex: 1,
												width: "100%"
											}}
										>
											<OnDoubleClickInput 
												value={dodatak.naziv} 
												onConfirm={(value) => promeniDodatak(dodatak.naziv, value)} 
												renderText={(value) => (
													<div
														style={{
															display: "flex",
															justifyContent: "flex-start",
															alignItems: "center",
															gap: "1rem"
														}}
													>
														<b>
															{value}
														</b>
														<GradientButton
															type="button"
															style={{
																borderRadius: "50%",
																width: 20,
																height: 20,
																padding: 0,
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																zIndex: 99999
															}} 
															onClick={() => handleDeleteDodatak(dodatak.naziv)}
														>
															<AiOutlineClose color="white" size={15} />
														</GradientButton>
													</div>
												)}
											/>
											
										</div>
									</div>
								))
							) : (
								<p style={{textAlign: "left", width: "100%", margin: 0}}>Nema dodataka za prikaz</p>
							)
						}
					</div>
				</div>
			)}
			{boje && (
				<div style={{marginBottom: "2rem"}}>
					<PageTitle level={3} style={{textAlign: "left", fontSize: 28, marginInline: windowSize.width <= 600 ? "0.5rem" : "2rem"}}>Boje</PageTitle>
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							gap: "2rem",
							paddingInline: windowSize.width <= 600 ? "0.5rem" : "4rem"
						}}
					>
						{
							boje.length > 0 ? (
								boje.map((boja, index) => (
									<div 
										key={index}
										style={{
											width: 50, 
											height: 50,
											margin: 0,
											position: "relative",
											background: boja.hex,
											border: "1px solid black",
											borderRadius: "50%",
										}}
									>
										<GradientButton
											type="button"
											style={{
												borderRadius: "50%",
												width: 20,
												height: 20,
												padding: 0,
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												position: "absolute",
												top: -5,
												right: -5,
												zIndex: 99999
											}} 
											onClick={() => handleDeleteBoje(boja.hex)}
										>
											<AiOutlineClose color="white" size={15} />
										</GradientButton>
									</div> 
								)) 
							) : (
								<p style={{textAlign: "left", width: "100%", margin: 0}}>Nema boja za prikaz</p>
							)
						}
					</div>
				</div>
			)}
			{slike && (
				<div style={{marginBottom: "2rem"}}>
					<PageTitle level={3} style={{textAlign: "left", fontSize: 28, marginInline: windowSize.width <= 600 ? "0.5rem" : "2rem"}}>Slike</PageTitle>
					<div
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							gap: "2rem",
							paddingInline: windowSize.width <= 600 ? "0.5rem" : "4rem"
						}}
					>
						{
							slike.length > 0 ? (
								<MasonryImageList 
									images={slike}
									handleDeleteImage={handleDeleteImage}
								/>
							) : (
								<p style={{textAlign: "left", width: "100%", margin: 0}}>Nema slika za prikaz</p>
							)
						}
					</div>
				</div>
			)}
		</div>
  	)
}

export default Ostalo

  
function MasonryImageList({images, handleDeleteImage}) {

	const [cols, setCols] = useState(1);
	const {windowSize} = useStateContext();

	useEffect(() => {
		if(windowSize.width <= 500) setCols(1);
		else if(windowSize.width <= 700) setCols(2);
		else if(windowSize.width <= 900) setCols(3);
		else if(windowSize.width <= 1200) setCols(4);
		else if(windowSize.width <= 1600) setCols(5);
		else if(windowSize.width <= 2000) setCols(6);
		else setCols(7);
	}, [windowSize])

	return (
		<Box sx={{ width: "100%", height: "100%", overflowY: 'scroll', overflowX: "hidden" }}>
			<ImageList variant="masonry" cols={cols} gap={8}>
			{images.map((item, index) => (
				<ImageListItem 
					key={item.src}
					style={{position: "relative"}}
				>
					<img
						src={`${IMAGE_HOST}${item.src}`}
						alt={item.src}
						loading="lazy"
					/>
					<GradientButton
						type="button"
						style={{
							borderRadius: "50%",
							width: 20,
							height: 20,
							padding: 0,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							position: "absolute",
							top: 5,
							right: 5,
							zIndex: 99999
						}} 
						onClick={() => handleDeleteImage(item.src)}
					>
						<AiOutlineClose color="white" size={15} />
					</GradientButton>
				</ImageListItem>
			))}
			</ImageList>
		</Box>
	);
}
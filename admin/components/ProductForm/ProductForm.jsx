/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { GradientButton, PageTitle, DragDropFile, Kvadrat } from '..'
import styles from "../../styles/form.module.css";
import { useCallback, useEffect, useState, useRef } from 'react';
import { useStateContext } from "../../context/ContextProvider";
import { BiSave } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { AiOutlinePlus, AiOutlineClose, AiOutlineFileAdd } from "react-icons/ai";
import { MdFileUpload } from "react-icons/md";
import { IoMdColorPalette, IoMdColorFilter } from "react-icons/io";
import { useRouter } from 'next/router';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import useStateWithCallback from '../../utils/hooks/useStateWithCallback';
import { ChromePicker } from 'react-color';

// const IMAGE_HOST = "http://localhost:10000";
const IMAGE_HOST = "https://thereptilehouse.rs"

function getFormData(proizvod) {
	return {
		naziv: {
			value: proizvod?.naziv ?? "",
			error: ""
		},
		cena: {
			value: proizvod?.cena ?? "",
			error: ""
		},
		preporuceno: {
			checked: !!(proizvod?.preporuceno)
		},
		thumbnail: {
			value: proizvod?.thumbnail ?? null,
			error: ""
		},
		slike: {
			value: proizvod?.slike ?? [],
			error: ""
		},
		dodaci: {
			value: proizvod?.dodaci ?? [],
			error: ""
		},
		boje: {
			value: proizvod?.boje ?? [],
			error: ""
		},
		opis: {
			value: proizvod?.opis ?? "",
			error: ""
		},
		duzina: {
			value: proizvod?.dimenzije?.duzina ?? "",
			error: ""
		},
		sirina: {
			value: proizvod?.dimenzije?.sirina ?? "",
			error: ""
		},
		visina: {
			value: proizvod?.dimenzije?.visina ?? "",
			error: ""
		},
		vrsta: {
			value: proizvod?.vrsta ?? "",
			error: ""
		},
		morf: {
			value: proizvod?.morf ?? "",
			error: ""
		},
		pol: {
			value: proizvod?.pol ?? "",
			error: ""
		},
		vreme: {
			value: proizvod?.vreme ?? "",
			error: ""
		},
		roditelji: {
			value: proizvod?.roditelji ?? "",
			error: ""
		},
		tezina: {
			value: proizvod?.tezina ?? "",
			error: ""
		},
		ostecenja: {
			value: proizvod?.ostecenja ?? "",
			error: ""
		},
	}
}

const fields = {
	"terarijumi": {
		opis: true,
		duzina: true,
		sirina: true,
		visina: true,
		vrsta: false,
		morf: false,
		pol: false,
		vreme: false,
		roditelji: false,
		tezina: false,
		ostecenja: false,
		dodaci: true,
		boje: true
	},
	"zivotinje": {
		opis: false,
		duzina: false,
		sirina: false,
		visina: false,
		vrsta: true,
		morf: true,
		pol: true,
		vreme: true,
		roditelji: true,
		tezina: true,
		ostecenja: true,
		dodaci: false,
		boje: false
	},
	"hrana": {
		opis: true,
		duzina: false,
		sirina: false,
		visina: false,
		vrsta: false,
		morf: false,
		pol: false,
		vreme: false,
		roditelji: false,
		tezina: false,
		ostecenja: false,
		dodaci: false,
		boje: false
	},
	"oprema": {
		opis: true,
		duzina: false,
		sirina: false,
		visina: false,
		vrsta: false,
		morf: false,
		pol: false,
		vreme: false,
		roditelji: false,
		tezina: false,
		ostecenja: false,
		dodaci: false,
		boje: false
	},
}

export default function ProductForm({kategorija, proizvod, onSave}) {

	const prikaz = fields[kategorija];

	const router = useRouter();
	const {createNotification, notificationTypes, setLoader} = useStateContext()

	const [slike, setSlike] = useStateWithCallback([]);
	const [dodaci, setDodaci] = useStateWithCallback([]);
	const [boje, setBoje] = useStateWithCallback([]);
	const [formData, setFormData] = useState(getFormData(proizvod))

	const fetchSlike = useCallback(async (cb, errcb) => {
		try {
			setLoader(true);
			const res = await fetch(`/api/slike/${kategorija}`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setSlike(json.data, cb);
			setTimeout(() => {
				setLoader(false);
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				})
				errcb?.();
			}, 1 * 1000);
		}
	}, [])

	const fetchDodaciBoje = useCallback(async (cb, errcb) => {
		try {
			setLoader(true);
			const res = await fetch(`/api/terarijumi/dodaci-boje`);
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setDodaci(json.data.dodaci, cb);
			setBoje(json.data.boje, cb);
			setTimeout(() => {
				setLoader(false);
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				})
				errcb?.();
			}, 1 * 1000);
		}
	}, [])

	useEffect(() => {
		setFormData(getFormData(proizvod));
	}, [proizvod])

	useEffect(() => {
		fetchSlike(null, () => router.push(`/${kategorija}`));
		if(kategorija === "terarijumi")
			fetchDodaciBoje(null, () => router.push("/terarijumi")); 	
	}, [])

	async function uploadFiles(files) {
		try {
			if(Array.from(files).length === 0)
				return;
			setLoader(true);
			const body  = new FormData();
			Array.from(files).forEach((file, index) => body.append("image"+index, file))
			body.append("kategorija", kategorija);
			const res = await fetch(`${IMAGE_HOST}/api/images`, {
				method: "POST",
				body,
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			return json;
		}
		catch(error) {
			console.error(error);
			createNotification({
				type: notificationTypes.ERROR,
				message: error.message
			})
			setLoader(false)
			return null;
		} 
	}
	
	async function dodajThumbnail(files) {
		const json = await uploadFiles(files)
		fetchSlike((_, slike) => {
			setFormData({...formData, thumbnail: {value: slike.find(slika => slika.id === json.ids[0]).src, error: ""}})
		});
	}

	async function dodajSlike(files) {
		const json = await uploadFiles(files)
		fetchSlike((_, slike) => {
			setFormData({...formData, slike: {value: [...formData.slike.value, ...json.ids.map(id => slike.find(slika => slika.id === id))], error: ""}})
		});
	}

	async function dodajBoju(hex) {
		try {
			if(!hex)
				return;
			setLoader(true);
			const res = await fetch(`/api/terarijumi/boje`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({hex}),
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchDodaciBoje((_, boje) => {
				if(!boje[0]?.hasOwnProperty("hex")) return;
				setFormData({...formData, boje: {value: [...formData.boje.value, boje.find(boja => boja.hex === hex)], error: ""}})
			});
		}
		catch(error) {
			console.error(error);
			createNotification({
				type: notificationTypes.ERROR,
				message: error.message
			})
			setLoader(false)
		} 
	}

	async function dodajDodatak(naziv) {
		try {
			if(!naziv)
				return;
			setLoader(true);
			const res = await fetch(`/api/terarijumi/dodaci`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({naziv}),
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			fetchDodaciBoje((_, dodaci) => {
				if(typeof dodaci[0] !== "string") return;
				setFormData({...formData, dodaci: {value: [...formData.dodaci.value, naziv], error: ""}})
			});
		}
		catch(error) {
			console.error(error);
			createNotification({
				type: notificationTypes.ERROR,
				message: error.message
			})
			setLoader(false)
		} 
	}

	function handleChange(e) {
		setFormData({...formData, [e.target.name]: {...formData[e.target.name], value: e.target.value}});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		let hasError = false;
		let formDataCopy = {...formData};

		if(!formDataCopy.naziv.value) {
			formDataCopy.naziv.error = "Morate uneti naziv."
			hasError = true;
		}
		else {
			formDataCopy.naziv.error = ""
		}

		if(!formDataCopy.cena.value) {
			formDataCopy.cena.error = "Morate uneti cenu."
			hasError = true;
		}
		else {
			formDataCopy.cena.error = ""
		}

		if(!formDataCopy.thumbnail.value) {
			formDataCopy.thumbnail.error = "Morate uneti thumbnail."
			hasError = true;
		}
		else {
			formDataCopy.thumbnail.error = ""
		}

		if(formDataCopy.slike.value.length === 0) {
			formDataCopy.slike.error = "Morate uneti makar jednu sliku."
			hasError = true;
		}
		else {
			formDataCopy.slike.error = ""
		}

		if(prikaz.opis) {
			if(!formDataCopy.opis.value) {
				formDataCopy.opis.error = "Morate uneti opis."
				hasError = true;
			}
			else {
				formDataCopy.opis.error = ""
			}
		}

		if(prikaz.duzina) {
			if(!formDataCopy.duzina.value) {
				formDataCopy.duzina.error = "Morate uneti dužinu."
				hasError = true;
			}
			else {
				formDataCopy.duzina.error = ""
			}
		}

		if(prikaz.visina) {
			if(!formDataCopy.visina.value) {
				formDataCopy.visina.error = "Morate uneti visinu."
				hasError = true;
			}
			else {
				formDataCopy.visina.error = ""
			}
		}

		if(prikaz.sirina) {
			if(!formDataCopy.sirina.value) {
				formDataCopy.sirina.error = "Morate uneti širinu."
				hasError = true;
			}
			else {
				formDataCopy.sirina.error = ""
			}
		}

		if(prikaz.vrsta) {
			if(!formDataCopy.vrsta.value) {
				formDataCopy.vrsta.error = "Morate uneti vrstu."
				hasError = true;
			}
			else {
				formDataCopy.vrsta.error = ""
			}
		}

		if(prikaz.morf) {
			if(!formDataCopy.morf.value) {
				formDataCopy.morf.error = "Morate uneti morf."
				hasError = true;
			}
			else {
				formDataCopy.morf.error = ""
			}
		}

		if(prikaz.pol) {
			if(!formDataCopy.pol.value) {
				formDataCopy.pol.error = "Morate uneti pol."
				hasError = true;
			}
			else {
				formDataCopy.pol.error = ""
			}
		}

		if(prikaz.vreme) {
			if(!formDataCopy.vreme.value) {
				formDataCopy.vreme.error = "Morate uneti vreme izleganja."
				hasError = true;
			}
			else {
				formDataCopy.vreme.error = ""
			}
		}

		if(prikaz.roditelji) {
			if(!formDataCopy.roditelji.value) {
				formDataCopy.roditelji.error = "Morate uneti roditelje."
				hasError = true;
			}
			else {
				formDataCopy.roditelji.error = ""
			}
		}

		if(prikaz.tezina) {
			if(!formDataCopy.tezina.value) {
				formDataCopy.tezina.error = "Morate uneti težinu."
				hasError = true;
			}
			else {
				formDataCopy.tezina.error = ""
			}
		}

		if(prikaz.ostecenja) {
			if(!formDataCopy.ostecenja.value) {
				formDataCopy.ostecenja.error = "Morate uneti oštećenja."
				hasError = true;
			}
			else {
				formDataCopy.ostecenja.error = ""
			}
		}

		if(prikaz.boje) {
			if(formDataCopy.boje.value.length === 0) {
				formDataCopy.boje.error = "Morate uneti makar jednu boju."
				hasError = true;
			}
			else {
				formDataCopy.boje.error = ""
			}
		}

		if(prikaz.dodaci) {
			if(formDataCopy.dodaci.value.length === 0) {
				formDataCopy.dodaci.error = "Morate uneti makar jedan dodatak."
				hasError = true;
			}
			else {
				formDataCopy.dodaci.error = ""
			}
		}
		
		if(hasError) {
			setFormData(formDataCopy);
			return;
		}
		console.log(formData, hasError)
		onSave?.(formData);
	}
	
	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className={styles.form}
			>
				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label htmlFor="naziv">Naziv *</label>
						{formData.naziv.error && <p className={styles.form_label_error}>{formData.naziv.error}</p>}
					</div>
					<input id="naziv" type="text" className={styles.form_input} name="naziv"  value={formData.naziv.value} onChange={handleChange} />
				</div>

				{ prikaz.opis && 
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="opis">Opis *</label>
							{formData.opis.error && <p className={styles.form_label_error}>{formData.opis.error}</p>}
						</div>
						<textarea id="opis" type="text" className={styles.form_textarea} name="opis"  value={formData.opis.value} onChange={handleChange} />
					</div>)
				}

				{
					prikaz.duzina &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="duzina">Dužina *</label>
							{formData.duzina.error && <p className={styles.form_label_error}>{formData.duzina.error}</p>}
						</div>
						<input id="duzina" min={0} step={0.01} type="number" className={styles.form_input} name="duzina"  value={formData.duzina.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.sirina &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="sirina">Širina *</label>
							{formData.sirina.error && <p className={styles.form_label_error}>{formData.sirina.error}</p>}
						</div>
						<input id="sirina" min={0} step={0.01} type="number" className={styles.form_input} name="sirina"  value={formData.sirina.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.visina &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="visina">Visina *</label>
							{formData.visina.error && <p className={styles.form_label_error}>{formData.visina.error}</p>}
						</div>
						<input id="visina" min={0} step={0.01} type="number" className={styles.form_input} name="visina"  value={formData.visina.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.vrsta &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="vrsta">Vrsta *</label>
							{formData.vrsta.error && <p className={styles.form_label_error}>{formData.vrsta.error}</p>}
						</div>
						<input id="vrsta" type="text" className={styles.form_input} name="vrsta"  value={formData.vrsta.value} onChange={handleChange} />
					</div>)
				}
				{ prikaz.morf &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="morf">Morf *</label>
							{formData.morf.error && <p className={styles.form_label_error}>{formData.morf.error}</p>}
						</div>
						<input id="morf" type="text" className={styles.form_input} name="morf"  value={formData.morf.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.pol &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="pol">Pol *</label>
							{formData.pol.error && <p className={styles.form_label_error}>{formData.pol.error}</p>}
						</div>
						<input id="pol" type="text" className={styles.form_input} name="pol"  value={formData.pol.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.vreme &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="vreme">Vreme izleganja *</label>
							{formData.vreme.error && <p className={styles.form_label_error}>{formData.vreme.error}</p>}
						</div>
						<input id="vreme" type="text" className={styles.form_input} name="vreme"  value={formData.vreme.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.roditelji &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="roditelji">Roditelji *</label>
							{formData.roditelji.error && <p className={styles.form_label_error}>{formData.roditelji.error}</p>}
						</div>
						<input id="roditelji" type="text" className={styles.form_input} name="roditelji"  value={formData.roditelji.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.tezina &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="tezina">Težina *</label>
							{formData.tezina.error && <p className={styles.form_label_error}>{formData.tezina.error}</p>}
						</div>
						<input id="tezina" type="text" className={styles.form_input} name="tezina"  value={formData.tezina.value} onChange={handleChange} />
					</div>)
				}

				{ prikaz.ostecenja &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="ostecenja">Vidljiva oštećenja *</label>
							{formData.ostecenja.error && <p className={styles.form_label_error}>{formData.ostecenja.error}</p>}
						</div>
						<textarea id="ostecenja" type="text" className={styles.form_textarea} name="ostecenja"  value={formData.ostecenja.value} onChange={handleChange} />
					</div>)
				}
				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label htmlFor="cena">Cena *</label>
						{formData.cena.error && <p className={styles.form_label_error}>{formData.cena.error}</p>}
					</div>
					<input id="cena" min={0} step={0.01} type="number" className={styles.form_input} name="cena"  value={formData.cena.value} onChange={handleChange} />
				</div>

				<div className={styles.form_column} style={{alignItems: "flex-start"}}>
					<FormControlLabel
						control={
							<Switch
								checked={formData.preporuceno.checked}
								onChange={e => setFormData({...formData, preporuceno: {checked: e.target.checked}})}
								color="secondary"
							/>
						}
						label={`Preporučeno`}
						labelPlacement="start"
					/>
				</div>

				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label 
							style={{
								display: "flex",
								gap: "1rem",
								justifyContent: "flex-start",
								alignItems: "center"
							}}
						>
							<span>Thumbnail *</span>
							<DodajSlike
								slike={slike?.filter(slika => slika.src !== formData.thumbnail.value)} 
								dodajNovu={dodajThumbnail} 
								odaberiPostojecu={(slike) => setFormData({...formData, thumbnail: {value: slike[0].src, error: ""}})} 
							/>
						</label>
						{
							formData.thumbnail.error && 
								(<p className={styles.form_label_error}>{formData.thumbnail.error}</p>)
						}
					</div>
					{
						(formData.thumbnail.value) &&
						(
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: "1rem",
									flexWrap: "wrap",
									background: "white",
									border: "1px solid black",
									borderRadius: 15,
									padding: "1rem",
									width: "100%",
									minHeight: 100
								}}
							>
								<div 
									style={{
										width: "auto", 
										height: 100,
										margin: "auto",
										position: "relative"
									}}
								>
									<img alt='thumbnail image' src={`${IMAGE_HOST}${formData.thumbnail.value}`} style={{objectFit: "contain", width: "100%", height: "100%"}} />
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
											top: -10,
											right: -10,
											zIndex: 99999
										}} 
										onClick={() => {
											setFormData({
												...formData,
												thumbnail: {
													error: "",
													value: null
												}
											})
										}}
									>
										<AiOutlineClose color="white" size={15} />
									</GradientButton>
								</div>
							</div>
						)
					}
				</div>

				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label 
							style={{
								display: "flex",
								gap: "1rem",
								justifyContent: "flex-start",
								alignItems: "center"
							}}
						>
							<span>Slike *</span>
							<DodajSlike
								slike={slike?.filter(slika => !formData.slike.value.map(item => item.id).join(", ").includes(slika.id))} 
								dodajNovu={dodajSlike} 
								odaberiPostojecu={(slike) => setFormData({...formData, slike: {value: [...formData.slike.value, ...slike], error: ""}})} 
								multiple
							/>
						</label>
						{
							formData.slike.error && 
								(<p className={styles.form_label_error}>{formData.slike.error}</p>)
						}
					</div>
					{
						(formData.slike.value.length > 0) &&
						(
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: "1rem",
									flexWrap: "wrap",
									background: "white",
									border: "1px solid black",
									borderRadius: 15,
									padding: "1rem",
									width: "100%",
									minHeight: 100
								}}
							>
								{
									formData.slike.value.map((slika, index) => (
										<div 
											key={index}
											style={{
												width: "auto", 
												height: 100,
												margin: "auto",
												position: "relative"
											}}
										>
											<img alt={`Slika ${index}`}  src={`${IMAGE_HOST}${slika.src}`} style={{objectFit: "contain", width: "100%", height: "100%"}} />
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
													top: -10,
													right: -10,
													zIndex: 99999
												}} 
												onClick={() => {
													setFormData({
														...formData,
														slike: {
															error: "",
															value: formData.slike.value.filter(item => item.src !== slika.src)
														}
													})
												}}
											>
										<AiOutlineClose color="white" size={15} />
									</GradientButton>
										</div> 
									))
								}
							</div>
						)
					}
				</div>

				{
					prikaz.boje &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label 
								style={{
									display: "flex",
									gap: "1rem",
									justifyContent: "flex-start",
									alignItems: "center"
								}}
							>
								<span>Boje *</span>
								<DodajBoje
									dodajNovu={dodajBoju} 
									odaberiPostojecu={(boje) => setFormData({...formData, boje: {error: "", value: [...formData.boje.value, ...boje]}})} 
									boje={boje}
								/>
							</label>
							{
								formData.boje.error && 
									(<p className={styles.form_label_error}>{formData.boje.error}</p>)
							}
						</div>
						{
							(formData.boje.value.length > 0) &&
							(<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									gap: "1rem",
									flexWrap: "wrap",
									background: "white",
									border: "1px solid black",
									borderRadius: 15,
									padding: "1rem",
									width: "100%",
									minHeight: 100
								}}
							>
								{
									formData.boje.value.map((boja, index) => (
										<div 
											key={index}
											style={{
												width: 50, 
												height: 50,
												margin: "auto",
												position: "relative",
												background: boja.hex,
												border: "1px solid black",
												borderRadius: "50%"
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
												onClick={() => {
													setFormData({
														...formData,
														boje: {
															error: "",
															value: formData.boje.value.filter(item => item.hex !== boja.hex)
														}
													})
												}}
											>
												<AiOutlineClose color="white" size={15} />
											</GradientButton>
										</div> 
									))
								}
							</div>
							)
						}
					</div>)
				}

				{
					prikaz.dodaci &&
					(<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label 
								style={{
									display: "flex",
									gap: "1rem",
									justifyContent: "flex-start",
									alignItems: "center"
								}}
							>
								<span>Dodaci</span>
								<DodajDodatke
									dodajNov={dodajDodatak} 
									odaberiPostojeci={(dodaci) => setFormData({...formData, dodaci: {error: "", value: [...formData.dodaci.value, ...dodaci]}})} 
									dodaci={dodaci.filter(dodatak => formData.dodaci.value.findIndex(item => item === dodatak) < 0)}
									// dodaci={dodaci}
								/>
							</label>
							{
								formData.dodaci.error && 
									(<p className={styles.form_label_error}>{formData.dodaci.error}</p>)
							}
						</div>
						{
							(formData.dodaci.value.length > 0) &&
							(
								<div
									style={{
										width: "100%",
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "flex-start"
									}}
								>
									<ul 
										style={{
											listStyle: "none",
											margin: 0
										}}
									>
										{
											formData.dodaci.value.map((dodatak, index) => (
												<li
													key={index}
													style={{
														width: "100%",
														paddingLeft: "0.75rem",
														paddingRight: "0.75rem",
														display: "flex",
														justifyContent: "flex-start",
														alignItems: "center",
														gap: "1rem",
														marginBottom: "0.5rem"
													}}
												>
													<Kvadrat />
													{dodatak}
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
														onClick={() => {
															setFormData({
																...formData,
																dodaci: {
																	error: "",
																	value: formData.dodaci.value.filter(item => item !== dodatak)
																}
															})
														}}
													>
														<AiOutlineClose color="white" size={15} />
													</GradientButton>
												</li>
											))
										}
									</ul>
								</div>
							)
						}
					</div>)
				}

				<div className={styles.form_row}>
					<GradientButton type="submit">
						<div
							style={{
								display:"flex",
								justifyContent: "center",
								alignItems: "center",
								gap: "1rem",
								paddingLeft: "1rem",
								paddingRight: "1rem"
							}}
						>
							<BiSave color="white" size={25} />
							<span>Sačuvaj</span>
						</div>
					</GradientButton>
				</div>
			</form>
		</div>
	)
}
  
function MasonryImageList({images, selected, setSelected}) {

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
	  <Box sx={{ width: "100%", height: "100%", overflowY: 'scroll' }}>
		<ImageList variant="masonry" cols={cols} gap={8}>
		  {images.map((item, index) => (
			<ImageListItem 
			  key={item.src}
			  style={{ 
				...(selected.findIndex(selected_index => selected_index === index) >= 0 ? {border: "5px dashed   #0283E9"} : {})
			}}
			onClick={() => {
				if(selected.findIndex(selected_index => selected_index === index) >= 0)
					setSelected(selected.filter(selected_index => selected_index !== index));
				else
					setSelected([...selected, index])
			}}
			>
			  <img
				src={`${IMAGE_HOST}${item.src}`}
				alt={item.src}
				loading="lazy"
			  />
			</ImageListItem>
		  ))}
		</ImageList>
	  </Box>
	);
}

function OdabirPostojeceSlike({slike, odaberiPostojecu, multiple}) {
	const [selected, setSelected] = useState([]);
	const {setModalOpen} = useStateContext();
	useEffect(() => {
		const last = selected[selected.length - 1] ?? -1;
		if(multiple || selected.length === 1 || last < 0) return;
		setSelected([last])
	}, [selected])
	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "1.5rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					overflow: "hidden",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{
					slike.length ? 
					(<MasonryImageList images={slike} selected={selected} setSelected={setSelected} />) :
					(<div
							style={{
								width: "100%",
								height: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<PageTitle level={6} style={{fontSize: 24, margin: 0}}>Nema slika za prikaz</PageTitle>
					</div>)
				}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<GradientButton 
					onClick={() => {
						odaberiPostojecu(selected.map(index => slike[index]));
						setModalOpen(false)
					}}
				>
					Odaberi
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</GradientButton>
			</div>
		</div>
	)
}

function OdabirPostojeceBoje({boje, odaberiPostojecu}) {
	const [selected, setSelected] = useState([]);
	const {setModalOpen} = useStateContext();

	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "1.5rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					overflow: "hidden",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "1rem",
						flexWrap: "wrap",
						borderRadius: 15,
						padding: "1rem",
						width: "100%",
					}}
				>
					{
						boje.map((boja, index) => (
							<div 
								key={index}
								style={{
									width: 50, 
									height: 50,
									margin: "auto",
									position: "relative",
									boxSizing: "content-box",
									background: boja.hex,
									border: selected.findIndex(selected_index => selected_index === index) < 0 ? "1px solid black" : "5px dashed #0283E9",
									borderRadius: "50%"
								}}
								onClick={() => {
									if(selected.findIndex(selected_index => selected_index === index) >= 0)
										setSelected(selected.filter(selected_index => selected_index !== index));
									else
										setSelected([...selected, index])
								}}
							/>
						))
					}
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<GradientButton 
					onClick={() => {
						odaberiPostojecu(selected.map(index => boje[index]));
						setModalOpen(false)
					}}
				>
					Odaberi
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</GradientButton>
			</div>
		</div>
	)
}

function OdabirPostojecegDodatka({dodaci, odaberiPostojeci}) {
	const [selected, setSelected] = useState([]);
	const {setModalOpen} = useStateContext();

	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "1.5rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-start",
					alignItems: "flex-start",
					width: "100%"
				}}
			>
				{
					dodaci.length === 0 ?
					(
						<div
							style={{
								width: "100%",
								height: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							<PageTitle level={6} style={{fontSize: 24, margin: 0}}>Nema dodataka za prikaz</PageTitle>
						</div>
					) : 
					(
						<div
							style={{
								overflowY: "auto",
								overflowX: "hidden",
								width: "100%",
								flex: 1
							}}
						>
							{
								dodaci.map(((dodatak, index) =>( 
									<div key={index}>
										<FormControlLabel
											control={
												<Checkbox
													checked={selected.findIndex(selected_index => selected_index === index) >= 0}
													onChange={e => selected.findIndex(selected_index => selected_index === index) >= 0 ? setSelected(selected.filter(selected_index => selected_index !== index)) : setSelected([...selected, index])}
													color="secondary"
												/>
											}
											label={dodatak}
											labelPlacement="end"
										/>
									</div>
								)))
							}
						</div>
					)
				}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<GradientButton 
					onClick={() => {
						odaberiPostojeci(selected.map(index => dodaci[index]));
						setModalOpen(false)
					}}
				>
					Odaberi
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</GradientButton>
			</div>
		</div>
	)
}

function DodavanjeNoveSlike({dodajNovu}) {
	const {setModalOpen} = useStateContext();
	const inputRef = useRef(null);
	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "1.5rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					overflow: "hidden",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<DragDropFile inputRef={inputRef} />
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<GradientButton 
					onClick={() => {
						dodajNovu(inputRef.current.files);
						setModalOpen(false)
					}}
				>
					Odaberi
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</GradientButton>
			</div>
		</div>
	)
}

function DodavanjeNoveBoje({dodajNovu}) {
	const {setModalOpen} = useStateContext();
	const [boja, setBoja] = useState("#00ff00");
	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "3rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					width: "100%",
					height: "100%",
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
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
					<ChromePicker 
						color={boja}
						onChangeComplete={color => setBoja(color.hex)}
						onChange={color => setBoja(color.hex)}
					/>
				</div>
				<div 
					style={{
						width: 150, 
						height: 50,
						margin: 0,
						position: "relative",
						background: boja,
						border: "1px solid black",
						borderRadius: 15
					}}
				/>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<GradientButton 
					onClick={() => {
						dodajNovu(boja);
						setModalOpen(false)
					}}
				>
					Odaberi
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</GradientButton>
			</div>
		</div>
	)
}

function DodavanjeNovogDodatka({dodajNov}) {
	const {setModalOpen} = useStateContext();
	const [text, setText] = useState("");
	return (
		<div 
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "3rem"
			}}
		>
			<div 
				style={{
					flex: 1, 
					width: "100%",
					height: "100%",
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label htmlFor="dodatak">Dodatak *</label>
					</div>
					<textarea id="dodatak" type="text" className={styles.form_textarea} name="dodatak"  value={text} onChange={e => setText(e.target.value)} />
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "1.5rem"
				}}
			>
				<GradientButton 
					onClick={() => {
						dodajNov(text);
						setModalOpen(false)
					}}
				>
					Odaberi
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					Odustani
				</GradientButton>
			</div>
		</div>
	)
}

function DodajSlike({dodajNovu, odaberiPostojecu, multiple, slike}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const {setModalOpen, setModalChildren} = useStateContext();
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	function onDodajNovo() {
		setModalChildren(<DodavanjeNoveSlike dodajNovu={dodajNovu}/>)
		setModalOpen(true)
		handleClose();
	}

	function onOdaberiPostojece() {
		setModalChildren(<OdabirPostojeceSlike multiple={multiple} slike={slike} odaberiPostojecu={odaberiPostojecu}/>)
		setModalOpen(true)
		handleClose();
	}
	return (
		<>
			<DodajButton
				onClick={handleClick}
			>
				<AiOutlinePlus color="black" size={25} />
			</DodajButton>
			<Menu 
				style={{zIndex: 9999}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={onDodajNovo}>
					<ListItemIcon>
						<MdFileUpload color="black" size={15}/>
					</ListItemIcon>
					<ListItemText>
						Dodaj novu sliku
					</ListItemText>
				</MenuItem>
				<MenuItem onClick={onOdaberiPostojece}>
					<ListItemIcon>
						<BsImage color="black" size={15} />
					</ListItemIcon>
					<ListItemText>
						Odaberi postojeću sliku
					</ListItemText>
				</MenuItem>
			</Menu>
		</>
	)
}

function DodajBoje({dodajNovu, odaberiPostojecu, boje}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const {setModalOpen, setModalChildren} = useStateContext();
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	function onDodajNovo() {
		setModalChildren(<DodavanjeNoveBoje dodajNovu={dodajNovu}/>)
		setModalOpen(true)
		handleClose();
	}

	function onOdaberiPostojece() {
		setModalChildren(<OdabirPostojeceBoje boje={boje} odaberiPostojecu={odaberiPostojecu}/>)
		setModalOpen(true)
		handleClose();
	}
	return (
		<>
			<DodajButton
				onClick={handleClick}
			>
				<AiOutlinePlus color="black" size={25} />
			</DodajButton>
			<Menu 
				style={{zIndex: 9999}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={onDodajNovo}>
					<ListItemIcon>
						<IoMdColorFilter color="black" size={15}/>
					</ListItemIcon>
					<ListItemText>
						Dodaj novu boju
					</ListItemText>
				</MenuItem>
				<MenuItem onClick={onOdaberiPostojece}>
					<ListItemIcon>
						<IoMdColorPalette color="black" size={15} />
					</ListItemIcon>
					<ListItemText>
						Odaberi postojeću boju
					</ListItemText>
				</MenuItem>
			</Menu>
		</>
	)
}

function DodajDodatke({dodajNov, odaberiPostojeci, dodaci}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const {setModalOpen, setModalChildren} = useStateContext();
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	
	function onDodajNov() {
		setModalChildren(<DodavanjeNovogDodatka dodajNov={dodajNov}/>)
		setModalOpen(true)
		handleClose();
	}

	function onOdaberiPostojeci() {
		setModalChildren(<OdabirPostojecegDodatka dodaci={dodaci} odaberiPostojeci={odaberiPostojeci}/>)
		setModalOpen(true)
		handleClose();
	}
	return (
		<>
			<DodajButton
				onClick={handleClick}
			>
				<AiOutlinePlus color="black" size={25} />
			</DodajButton>
			<Menu 
				style={{zIndex: 9999}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={onDodajNov}>
					<ListItemIcon>
						<AiOutlinePlus color="black" size={15}/>
					</ListItemIcon>
					<ListItemText>
						Dodaj nov dodatak
					</ListItemText>
				</MenuItem>
				<MenuItem onClick={onOdaberiPostojeci}>
					<ListItemIcon>
						<AiOutlineFileAdd color="black" size={15} />
					</ListItemIcon>
					<ListItemText>
						Odaberi postojeć dodatak
					</ListItemText>
				</MenuItem>
			</Menu>
		</>
	)
}

function DodajButton({style, ...props}) {
	return (
		<div
			style={{
				cursor: "pointer",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: 0,
				width: 40,
				height: 40,
				borderRadius: "50%",
				background: "white",
				border: "1px solid black",
				...style
			}}
			{...props}
		>
			<AiOutlinePlus color="black" size={25} />	
		</div>
	)
}
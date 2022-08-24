import { PageTitle, GradientButton, Page } from '../components'
import styles from "../styles/form.module.css";
import { useState } from 'react';
import { useStateContext } from "../context/ContextProvider";
import { RiLoginCircleLine } from "react-icons/ri";
import { useRouter } from 'next/router';
import Head from 'next/head';

const initialFormData = {
	mejl: {
		value: "",
		error: ""
	},
	lozinka: {
		value: "",
		error: ""
	}
}

function Login() {

	const router = useRouter();
	const {setKorisnik, createNotification, notificationTypes, setLoader} = useStateContext()

	const [formData, setFormData] = useState(initialFormData)

	function handleChange(e) {
		setFormData({...formData, [e.target.name]: {...formData[e.target.name], value: e.target.value}});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		
		let hasError = false;
		let formDataCopy = {...formData};

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

		if(!formDataCopy.lozinka.value) {
			formDataCopy.lozinka.error = "Morate uneti lozinku."
			hasError = true;
		}
		else {
			formDataCopy.lozinka.error = ""
		}
		
		if(hasError) {
			setFormData(formDataCopy);
			return;
		}

		try {
			setLoader(true);
			const res = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					mejl: formDataCopy.mejl.value,
					lozinka: formDataCopy.lozinka.value
				})
			})
			const json = await res.json();
			if(!json.ok)
				throw new Error(json.message);
			setKorisnik(json.korisnik);
			setTimeout(() => {
				setLoader(false);createNotification({
					type: notificationTypes.SUCCESS,
					message: `Uspešno ste se prijavili kao ${json.korisnik.ime} ${json.korisnik.prezime}`,
					title: "Usprešna prijava"
				})
				router.push("/");
			}, 1 * 1000);
		} catch (error) {
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				})
			}, 1 * 1000);
		}
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh"
			}}
		>
			<Head>
				<title>Prijava | The Reptile House</title>
				<meta
					name="description"
					content="Stranica za prijavu administratora"
				/>
			</Head>
			<Page
				style={{
					minHeight: "auto",
					paddingBottom: "5rem",
					paddingTop: "5rem",
				}}
			>
				<PageTitle>Prijava</PageTitle>
				<form
					onSubmit={handleSubmit}
					className={styles.form}
					style={{
						marginTop: "3rem"
					}}
				>
					<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="mejl">Mejl *</label>
							{formData.mejl.error && <p className={styles.form_label_error}>{formData.mejl.error}</p>}
						</div>
						<input id="mejl" type="text" className={styles.form_input} name="mejl"  value={formData.mejl.value} onChange={handleChange} />
					</div>
					<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label htmlFor="lozinka">Lozinka *</label>
							{formData.lozinka.error && <p className={styles.form_label_error}>{formData.lozinka.error}</p>}
						</div>
						<input id="lozinka" type="password" className={styles.form_input} name="lozinka"  value={formData.lozinka.value} onChange={handleChange} />
					</div>
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
								<RiLoginCircleLine stroke="#fff" size={20}/>
								<span>Prijavi se</span>
							</div>
						</GradientButton>
					</div>
				</form>
			</Page>
		</div>
	)
}

export default Login
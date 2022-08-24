import { PageTitle, GradientButton } from '../components'
import styles from "../styles/form.module.css";
import { useState } from 'react';
import { useStateContext } from "../context/ContextProvider";
import Head from 'next/head'

const initialFormData = {
	stara: {
		value: "",
		error: ""
	},
	nova: {
		value: "",
		error: ""
	},
	potvrda: {
		value: "",
		error: ""
	},

}


function PromenaLozinke() {

	const {createNotification, notificationTypes, setLoader} = useStateContext();
	const [formData, setFormData] = useState(initialFormData)

	function handleChange(e) {
		setFormData({...formData, [e.target.name]: {...formData[e.target.name], value: e.target.value}});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		
		let hasError = false;
		let formDataCopy = {...formData};

		if(!formDataCopy.stara.value) {
			formDataCopy.stara.error = "Morate uneti staru lozinku."
			hasError = true;
		}
		else {
			formDataCopy.stara.error = ""
		}

		if(!formDataCopy.nova.value) {
			formDataCopy.nova.error = "Morate uneti novu lozinku."
			hasError = true;
		}
		else {
			formDataCopy.nova.error = ""
		}

		if(!formDataCopy.potvrda.value) {
			formDataCopy.potvrda.error = "Morate potvrditi novu lozinku ."
			hasError = true;
		}
		else {
			formDataCopy.potvrda.error = ""
		}

		if(formDataCopy.nova.value && formData.potvrda.value) {
			if(formDataCopy.nova.value !== formDataCopy.potvrda.value) {
				formDataCopy.nova.error = "Lozinke se ne podudaraju";
				formDataCopy.potvrda.error = "Lozinke se ne podudaraju";
				hasError = true;
			}
			else {
				formDataCopy.nova.error = "";
				formDataCopy.potvrda.error = "";
			}
		}
		
		if(hasError) {
			setFormData(formDataCopy);
			return;
		}
		
		try {
			setLoader(true);
			const res = await fetch("/api/change-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					stara: formData.stara.value,
					nova: formData.nova.value,
					potvrda: formData.potvrda.value
				})
			})
			const data = await res.json();
			if(!data.ok)
				throw new Error(data.message);
				
			setTimeout(() => {
				setFormData(initialFormData)
				setLoader(false)
				createNotification({
					type: notificationTypes.SUCCESS,
					message: "Lozinka uspešno promenjena"
				})
			}, 1 * 1000);
		} catch (error) {
			console.error(error);
			
			setTimeout(() => {
				setLoader(false)
				createNotification({
					type: notificationTypes.error,
					message: error.message
				})
			}, 1 * 1000);
		}
	}

	return (
		<div>
			<Head>
				<title>Promena lozinke | The Reptile House</title>
				<meta
					name="description"
					content="Stranica za promenu lozinke"
				/>
			</Head>
			<PageTitle>Promena lozinke</PageTitle>
			<form
				onSubmit={handleSubmit}
				className={styles.form}
			>
				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label htmlFor="stara">Stara lozinka *</label>
						{formData.stara.error && <p className={styles.form_label_error}>{formData.stara.error}</p>}
					</div>
					<input id="stara" type="password" className={styles.form_input} name="stara"  value={formData.stara.value} onChange={handleChange} />
				</div>
				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label htmlFor="nova">Nova lozinka *</label>
						{formData.nova.error && <p className={styles.form_label_error}>{formData.nova.error}</p>}
					</div>
					<input id="nova" type="password" className={styles.form_input} name="nova"  value={formData.nova.value} onChange={handleChange} />
				</div>
				<div className={styles.form_column}>
					<div className={styles.form_label}>
						<label htmlFor="potvrda">Potvrdite novu lozinku *</label>
						{formData.potvrda.error && <p className={styles.form_label_error}>{formData.potvrda.error}</p>}
					</div>
					<input id="potvrda" type="password" className={styles.form_input} name="potvrda"  value={formData.potvrda.value} onChange={handleChange} />
				</div><div className={styles.form_row}>
					<GradientButton type="submit">
						<div
							style={{
								display:"flex",
								justifyContent: "center",
								alignItems: "center"
							}}
						>
							Promeni
						</div>
					</GradientButton>
				</div>
			</form>
		</div>
	)
}

export default PromenaLozinke
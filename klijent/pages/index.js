import Head from 'next/head'
import { useEffect, useState } from 'react'
import {ProductCard, PageTitle, GradientButton} from "../components";
import { useStateContext } from '../context/ContextProvider';
import styles from "../styles/homepage.module.css"
import {FiSend} from "react-icons/fi";

import { Navigation} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import preporuceno from '../database/preporuceno';


export default function Home(props) {
	
	const {windowSize} = useStateContext();

	return (
		<div>
			<Head>
				<title>The Reptile House</title>
				<meta 
					name="description" 
					content="The reptile house se bavi uzgojem i prodajom reptila i insekata, kao i izradom terarijuma za odgoj istih. Strogom selekcijom, pravilnim ukrštanjem i odgojem zdravih životinja, specifičnih boja i gena, trudimo se teraristiku predstavimo u pravom svetlu." 
				/>
			</Head>
			<Hero />
			<Preporuceno data={props.preporuceno} widthPercent={0.9} />
			<section className={styles.quote}>
				<p className={styles.quote_p}>
					Strogom selekcijom, pravilnim ukrštanjem i odgojem zdravih životinja, specifičnih boja i gena, trudimo se teraristiku predstavimo u pravom svetlu.
				</p>
			</section>
			<PitanjeForma />
		</div>
	)
}

export async function getStaticProps() {
	
	const prep = await preporuceno();
	return {
		props: {
			preporuceno: prep
		},
		revalidate: 60
	}
}




const initialFormData = {
	ime: {
		value: "",
		error: ""
	},
	mejl: {
		value: "",
		error: ""
	},
	poruka: {
		value: "",
		error: ""
	},

}

function PitanjeForma() {

	const {createNotification, notificationTypes} = useStateContext();
	const [formData, setFormData] = useState(initialFormData)

	function handleChange(e) {
		setFormData({...formData, [e.target.name]: {...formData[e.target.name], value: e.target.value}});
	}

	function handleSubmit(e) {
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

		if(!formDataCopy.poruka.value) {
			formDataCopy.poruka.error = "Morate uneti poruku."
			hasError = true;
		}
		else {
			formDataCopy.poruka.error = ""
		}
		
		if(hasError) {
			setFormData(formDataCopy);
			return;
		}

		setFormData(initialFormData)
		createNotification({
			type: notificationTypes.SUCCESS,
			message: "Poruka uspešno poslata. Možete očekivati odgovor u narednih par dana."
		})
	}

	return (
		<section className={styles.form_container}>
			<PageTitle level={3} style={{fontSize: 32}}>Imate pitanja? Pošaljite nam poruku</PageTitle>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.form_row}>
					<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label>Ime *</label>
							{formData.ime.error && <p className={styles.form_label_error}>{formData.ime.error}</p>}
						</div>
						<input className={styles.form_input} name="ime" value={formData.ime.value} onChange={handleChange} />
					</div>
					<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label>Mejl *</label>
							{formData.mejl.error && <p className={styles.form_label_error}>{formData.mejl.error}</p>}
						</div>
						<input className={styles.form_input} name="mejl"  value={formData.mejl.value} onChange={handleChange} />
					</div>
				</div>
				<div className={styles.form_row}>
					<div className={styles.form_column}>
						<div className={styles.form_label}>
							<label>Poruka *</label>
							{formData.poruka.error && <p className={styles.form_label_error}>{formData.poruka.error}</p>}
						</div>
						<textarea className={styles.form_textarea} name="poruka" value={formData.poruka.value} onChange={handleChange} />
					</div>
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
							<FiSend stroke="#fff"/>
							<span>Pošalji</span>
						</div>
					</GradientButton>
				</div>
			</form>
		</section>
	)
}



function Hero() {

	const {navHeight, windowSize} = useStateContext()

	return (
		<header className={styles.hero} style={{minHeight: `calc(100vh - ${navHeight}px)`}}>
			<div className={styles.hero_text}  style={{...(windowSize.width > 900 ? {minHeight: `calc(75vh - ${navHeight}px)`} : {})}}>
				<PageTitle className={styles.hero_text_title}>The Reptile House</PageTitle>
				<p className={styles.hero_text_p}>The Reptile House se bavi uzgojem i prodajom reptila i insekata, kao i izradom terarijuma za odgoj istih.</p>
				<Link href="/terarijumi">
					<span><GradientButton className={styles.hero_text_button}>Pregledaj</GradientButton></span>
				</Link>
			</div>
			<div className={styles.hero_image}>
				<img className={styles.hero_image_blob} alt="" src="/home_blob.svg" />
				<img className={styles.hero_image_image} alt="" src="/home_image.png" />
			</div>
		</header>
	)
}

function Preporuceno({data, widthPercent}) {

	const {windowSize} = useStateContext();
	const [containerWidth, setContainerWidth] = useState(windowSize.width * widthPercent );
	const [slidesPerView, setSlidesPerView] = useState(1);

	useEffect(() => {
		setContainerWidth(windowSize.width * widthPercent)
	}, [windowSize])

	useEffect(() => {
		if(containerWidth >= 2400) 
			setSlidesPerView(7);
		else if(containerWidth >= 2000) 
			setSlidesPerView(6);
		else if(containerWidth >= 1600) 
			setSlidesPerView(5);
		else if(containerWidth >= 1250) 
			setSlidesPerView(4);
		else if(containerWidth >= 950) 
			setSlidesPerView(3);
		else if(containerWidth >= 600) 
			setSlidesPerView(2);
		else 
			setSlidesPerView(1);
	}, [containerWidth])

	return (
		<section>
			<PageTitle level={2} style={{fontSize: 32}}>
				Preporučeno: 
			</PageTitle>
			<div
				style={{
					width: isNaN(containerWidth) ? "100%" : containerWidth,
					margin: "auto"
				}}
			>
				<Swiper
					modules={[Navigation]}
					loop
					autoplay={{
						delay: 2000,
					}}
					slidesPerView={slidesPerView}
					navigation
				>
					{
						data.map((item, index) => <SwiperSlide key={index} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
							<ProductCard 
								{...item} 
								url={`/${item.kategorija}/${item.id}`} 
								style={{
									margin: "1rem",
									width: 350
								}}
							/>
						</SwiperSlide>)
					}
				</Swiper>
			</div>
		</section>
	  );
}
/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react'
import { PageTitle, ProductForm } from '../../components'
import { useStateContext } from '../../context/ContextProvider';

function Terarijum() {

	const router = useRouter();
	const [data, setData] = useState(null);
	const {setLoader, createNotification, notificationTypes} = useStateContext();

	const fetchData = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch(`/api/terarijumi/${router.query.id}`);
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
				router.push("/");
			}, 1 * 1000);
		}
	}, [])

	async function onSave(formData) {
		try {
			setLoader(true);
			const body = {
				id: data.id,
				naziv: formData.naziv.value,
				cena: formData.cena.value,
				preporuceno: formData.preporuceno.checked,
				thumbnail: formData.thumbnail.value,
				slike: formData.slike.value.map(slika => slika.id),
				opis: formData.opis.value,
				duzina: formData.duzina.value,
				sirina: formData.sirina.value,
				visina: formData.visina.value,
				boje: formData.boje.value,
				dodaci: formData.dodaci.value
			}
			const res = await fetch(`/api/terarijumi/${data.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.SUCCESS,
					message: `Terarijum uspešno ažuriran`
				});
				router.push("/terarijumi");
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

	useEffect(() => {
		fetchData();
	}, [])

	return (
		<div>
			<Head>
				<title>{data?.naziv ?? "Terarijumi"} | The Reptile House</title>
				<meta
					name="description"
					content="Stranica jednog terarijuma"
				/>
			</Head>
			<PageTitle>{data?.naziv || "Učitavanje"}</PageTitle>
			<ProductForm kategorija="terarijumi" proizvod={data} onSave={onSave} />
		</div>
	)
}

export default Terarijum
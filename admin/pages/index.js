import { GradientButton, PageTitle, Page } from "../components";
import { useStateContext } from "../context/ContextProvider";
import { useRouter } from "next/router";
import Head from 'next/head'

export default function Home() {

	const router = useRouter();
	const {korisnik, setLoader, createNotification, notificationTypes} = useStateContext();

	async function logout() {
		try {
			const res = await fetch("/api/logout");
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			createNotification({
				type: notificationTypes.SUCCESS,
				message: "Uspešno ste se odjavili",
				title: "Usprešna odjava"
			})
			router.push("/login")
		} catch (error) {
			createNotification({
				type: notificationTypes.ERROR,
				message: error.message
			})
		}
		finally {
			setLoader(false)
		}
	}

	return (
		<div>
			<Head>
				<title>The Reptile House</title>
				<meta
					name="description"
					content="Početna stranica administratorskog panela"
				/>
			</Head>
			<PageTitle>Admin Dashboard</PageTitle>
			<p>Zdravo, {korisnik.ime} {korisnik.prezime}</p>
			
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
			<p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p><p>HELLLOO</p>
		</div>
	)
}

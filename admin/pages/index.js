import { GradientButton, PageTitle, Page } from "../components";
import { useStateContext } from "../context/ContextProvider";
import { useRouter } from "next/router";
import Head from 'next/head'

export default function Home() {

	const router = useRouter();
	const {korisnik, setLoader, createNotification, notificationTypes} = useStateContext();

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
		</div>
	)
}

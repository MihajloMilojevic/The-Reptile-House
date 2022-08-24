/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react'
import { PageTitle, ProductList, GradientButton } from '../../components'
import { useStateContext } from '../../context/ContextProvider';
import {AiOutlinePlus} from "react-icons/ai";
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';

function Zivotinje() {

	const router = useRouter();
	const [data, setData] = useState(null);
	const {setLoader, createNotification, notificationTypes} = useStateContext();

	
	const fetchData = useCallback(async () => {
		try {
			setLoader(true);
			const res = await fetch("/api/zivotinje");
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

	useEffect(() => {
		fetchData();
	}, [])

	return (
		<div>
			<Head>
				<title>Životinje | The Reptile House</title>
				<meta
					name="description"
					content="Stranica sa svim životinjama"
				/>
			</Head>
			<PageTitle>Životinje</PageTitle>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					padding: "2rem",
					paddingTop: 0
				}}
			>
				<Tooltip
					enterTouchDelay={0} arrow 
					title="Kreiraj"
					PopperProps={{ style: { zIndex: 99999} }}
				>
					<div style={{display: "inline", width: "auto"}}>
						<GradientButton
							style={{
								borderRadius: "50%",
								width: 60,
								height: 60,
								padding: 0,
								// width: "100%",
								// padding: "0.5rem",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}} 
						>
							<Link href={"/zivotinje/kreiraj"}><AiOutlinePlus color="white" size={40} /></Link>
						</GradientButton>
					</div>
				</Tooltip>
			</div>
			{ data && (
				data.length > 0 ?	
				<ProductList data={data} category="zivotinje" refresh={fetchData} /> :
				<PageTitle level={6} style={{fontSize: 24, marginTop: "5rem"}}>Nema životinja za prikaz</PageTitle>
			)}
		</div>
	)
}

export default Zivotinje
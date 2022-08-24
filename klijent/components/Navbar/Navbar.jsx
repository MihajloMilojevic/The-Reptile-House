import Link from "next/link";
import styles from "./Navbar.module.css";
import {AiOutlineMenu, AiOutlineClose} from "react-icons/ai"
import {BiBasket} from "react-icons/bi"
import { useStateContext } from "../../context/ContextProvider";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";


const links = [
	{
		href: "/",
		text: "Početna"
	},
	{
		href: "/zivotinje",
		text: "Životinje"
	},
	{
		href: "/terarijumi",
		text: "Terarijumi"
	},
	{
		href: "/hrana",
		text: "Hrana"
	},
	{
		href: "/oprema",
		text: "Oprema"
	}
]

function Navbar() {

	const navRef = useRef(null);

	const router = useRouter();
	const {activeMenu, setActiveMenu, windowSize, korpa, setNavHeight} = useStateContext();

	useEffect(() => {
		setNavHeight(navRef.current.clientHeight);
		if(windowSize.width > 900)
			setActiveMenu(false);
	}, [windowSize])

	useEffect(() => {
		setActiveMenu(false)
	},[router.route])

	return (
		<nav className={styles.navbar} id="navbar" ref={navRef}>
			<Link href="/">
				<div className={styles.navbar__logo} onClick={() => setActiveMenu(false)}>
					<img src="/logo-no-bg.png" alt="Logo" width={50} height={50}/>
					<span>The reptile house</span>
				</div>
			</Link>
			<div className={`${styles.navbar__links} ${windowSize.width <= 900 ? (activeMenu ? styles.active : styles.inactive) : ""}`}>
				{
					links.map(link => (
						<div key={link.href + "-" + link.text}  onClick={() => setActiveMenu(false)}>
							<Link href={link.href}>{link.text}</Link>
						</div>
					))
				}
				<Link href="/korpa">
					<div style={{display: "flex", justfyContent: "space-between"}}>
						<div className={styles.navbar__links_korpa}>
							<BiBasket color="black" size={25}/>
							<span className={`gradient ${styles.navbar__links_korpa_broj}`}>{korpa.length}</span>
						</div>
						{windowSize.width <= 900 && <span style={{marginLeft: "1rem", verticalAlign: "middle"}}>Korpa</span>}
					</div>
				</Link>
			</div>
			<div className={styles.navbar_menu} onClick={() => setActiveMenu(prevActiveMenu => !prevActiveMenu)}>
				{ activeMenu ? <AiOutlineClose /> : <AiOutlineMenu />}
			</div>
		</nav>
	)
}

export default Navbar
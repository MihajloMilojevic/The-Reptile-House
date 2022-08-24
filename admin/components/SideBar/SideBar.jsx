/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./SideBar.module.css";
import Link from "next/link"
import Image from "next/image";
import { useRouter } from "next/router";
import { GradientButton } from "..";
import {AiOutlineClose} from "react-icons/ai"
import { useStateContext } from "../../context/ContextProvider";

const links = [
	{
		text: "Početna",
		href: "/"
	},
	{
		text: "Terarijumi",
		href: "/terarijumi"
	},
	{
		text: "Životinje",
		href: "/zivotinje"
	},
	{
		text: "Oprema",
		href: "/oprema"
	},
	{
		text: "Hrana",
		href: "/hrana"
	},
	{
		text: "Porudžbine",
		href: "/porudzbine"
	},
]

function SideBar() {

	const {windowSize, setActiveMenu} = useStateContext();
	const router = useRouter();

	function linkClik() {
		if(windowSize.width <= 900) setActiveMenu(false);
	}

	return (
		<div className={styles.sidebar}>
			{
				windowSize.width <= 900 && 
				<GradientButton 
					style={{
						borderRadius: "50%",
						width: 30,
						height: 30,
						padding: 0,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "absolute",
						top: "1.5rem",
						right: "1.5rem"
					}} 
					onClick={
						() => setActiveMenu(false)
					}
				>
					<AiOutlineClose color="white" size={15} />
				</GradientButton>
			}
			<div>
				<Link href="/">
					<div className={styles.sidebar_brand} onClick={linkClik}>
						<Image src="/logo-no-bg.png" alt="Logo" width={50} height={50}/>
						<span>The reptile house</span>
					</div>
				</Link>
			</div>
			<div className={styles.sidebar_links}>
				{
					links.map((item, index) => (
						<Link 
							key={index} 
							href={item.href} 
						>
							<p onClick={linkClik} className={`${styles.sidebar_link} ${(router.pathname.startsWith(item.href) && item.href !== "/") || router.pathname === "/" && item.href === "/" ? "gradient text-white " : styles.sidebar_link_hoverable}`}>
								{item.text}
							</p>
						</Link>
					))
				}
			</div>
		</div>
	)
}

export default SideBar
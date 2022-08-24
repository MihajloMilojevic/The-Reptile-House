import {useStateContext} from "../../context/ContextProvider";
import {useRouter} from "next/router";
import {GradientButton, Line} from "..";
import {AiOutlineClose} from "react-icons/ai"
import styles from "./Profile.module.css";
import { useState } from "react";
import Link from "next/link";
import {RiLockPasswordLine, RiLogoutCircleRLine} from "react-icons/ri";


function Profile() {
	
	const [openDropdown, setOpenDropdown] = useState(false);
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
		<div className={styles.profile}>
			<p className={styles.profile_toggle} onClick={() => setOpenDropdown(prev => !prev)}>{korisnik.ime[0].toUpperCase()}. {korisnik.prezime}</p>
			{
				openDropdown && (
					<div className={`${styles.profile_dropdown} box-shadow`}>
						<div className={styles.profile_dropdown_header}>
							<h3>Korisnički profil</h3>
							<GradientButton 
								style={{
									borderRadius: "50%",
									width: 30,
									height: 30,
									padding: 0,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}} 
								onClick={
									() => setOpenDropdown(false)
								}
							>
								<AiOutlineClose color="white" size={15} />
							</GradientButton>
						</div>
						<div className={styles.profile_dropdown_data}>
							<p className={styles.profile_dropdown_data_name}>{korisnik.ime} {korisnik.prezime}</p>
							<p className={styles.profile_dropdown_data_role}>Administrator</p>
							<p className={styles.profile_dropdown_data_mail}><a target="_blank" rel="noreferrer" href={`mailto:${korisnik.mejl}`}>{korisnik.mejl}</a></p>
						</div>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}><Line color={"#555555"} width="50%"/></div>
						<Link href="/promena-lozinke">
							<div className={styles.profile_dropdown_link} onClick={() => setOpenDropdown(false)}>
								<RiLockPasswordLine color="black"/>
								<span>Promeni lozinku</span>
							</div>
						</Link>
						<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: 0, padding:0}}><Line color={"#555555"} width="50%"/></div>
						<div 
							className={styles.profile_dropdown_link}
							onClick={() => {setOpenDropdown(false); logout()}}
						>
							<RiLogoutCircleRLine />
							<span>Odjavi se</span>
						</div>
					</div>
				)
			}
		</div>
	)
}

export default Profile
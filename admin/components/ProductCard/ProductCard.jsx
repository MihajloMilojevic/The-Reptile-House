/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import styles from "./ProductCard.module.css";
import {GradientButton} from ".."
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Tooltip from '@mui/material/Tooltip';

const IMAGE_HOST = "https://thereptilehouse.rs"
// const IMAGE_HOST = "http://localhost:10000"

function ProductCard(props) {

	const {openDeleteDialog, setLoader, createNotification, notificationTypes} = useStateContext();

	async function deleteProduct() {
		try {
			setLoader(true)
			const res = await fetch(`/api/${props.category}/${props.id}`, {method: "DELETE"});
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			props.refresh();
			createNotification({
				type: notificationTypes.SUCCESS,
				message: `Uspešno obrisan '${props.naziv}'`
			})
		} catch (error) {
			console.error(error)
			createNotification({
				type: notificationTypes.ERROR,
				message: error.message
			})
			setLoader(false);
		}
	}

	return (
		<div className={styles.product_card} style={props.style ?? {}}>
			<div className={styles.product_card_image} style={{cursor: "pointer"}}>
				<a target="_blank" rel="noreferrer" href={`${IMAGE_HOST}/${props.category}/${props.id}`}>
					<img src={`${IMAGE_HOST}${props.thumbnail}`} alt={props.naziv}/>
				</a>
			</div>
			<div className={styles.product_card_content}>
				<a target="_blank" rel="noreferrer" href={`${IMAGE_HOST}/${props.category}/${props.id}`}>
					<h3 style={{cursor: "pointer"}}>{props.naziv}</h3>
				</a>
				<div className={styles.product_card_content_row} style={{gap: "1rem"}}>
					<Tooltip
						enterTouchDelay={0} arrow 
						title="Izmeni"
						PopperProps={{ style: { zIndex: 99999} }}
					>
						<div style={{width: "100%"}}>
							<Link href={`/${props.category}/${props.id}`}>
								<GradientButton
									style={{
										// borderRadius: "50%",
										// width: 40,
										// height: 40,
										// padding: 0,
										width: "100%",
										padding: "0.5rem",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}} 
								>
									<MdEdit color="white" size={25} />
								</GradientButton>
							</Link>
						</div>
					</Tooltip>
					<Tooltip
						enterTouchDelay={0} arrow 
						title="Obriši"
						PopperProps={{ style: { zIndex: 99999} }}
					>
						<div style={{width: "100%"}}>
							<GradientButton
								style={{
									// borderRadius: "50%",
									// width: 40,
									// height: 40,
									// padding: 0,
									width: "100%",
									padding: "0.5rem",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}} 
								onClick={() => openDeleteDialog({
									naziv: props.naziv, 
									onYes: () => deleteProduct
								})}
							>
									<div>
										<MdDeleteForever color="white" size={25} />
									</div>
							</GradientButton>
						</div>
					</Tooltip>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
import Link from "next/link";
import styles from "./ProductCard.module.css";
import {GradientButton} from ".."
import { useStateContext } from "../../context/ContextProvider";

function ProductCard(props) {

	const {dodajUKorpu} = useStateContext();

	function dodaj() {
		const item = {
			naziv: props.naziv,
			id: props.id,
			cena: props.cena,
			thumbnail: props.thumbnail,
			kolicina: 1,
			...(props.boje ? {boja: props.boje[0]} : {}),
			doplate: []
		}
		dodajUKorpu(item)
	}

	return (
		
		<div className={styles.product_card}>
			<div className={styles.product_card_image} style={{cursor: "pointer"}}>
				<Link href={props.url}>
					<img src={props.thumbnail} alt={props.naziv}/>
				</Link>
			</div>
			<div className={styles.product_card_content}>
				<Link href={props.url}>
					<h3 style={{cursor: "pointer"}}>{props.naziv}</h3>
				</Link>
				<div className={styles.product_card_content_row}>
					<p>{props.cena}din.</p>
					<GradientButton onClick={dodaj}>
						Dodaj u korpu
					</GradientButton>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
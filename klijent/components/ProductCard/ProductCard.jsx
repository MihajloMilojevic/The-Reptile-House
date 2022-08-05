import Link from "next/link";
import styles from "./ProductCard.module.css";
import {GradientButton} from ".."
import { useStateContext } from "../../context/ContextProvider";

function ProductCard(props) {

	const {dodajUKorpu} = useStateContext();

	function dodaj() {
		const obj = {...props, kolicina: 1};
		if(props.boje)
			obj.boja = props.boje[0];
		dodajUKorpu(obj)
	}

	return (
		
		<div className={styles.product_card}>
			<div className={styles.product_card_image} style={{cursor: "pointer"}}>
				<Link href={props.url}>
					<img src={props.tumbnail} alt={props.naziv}/>
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
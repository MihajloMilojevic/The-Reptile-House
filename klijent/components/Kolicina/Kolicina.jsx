import { useEffect, useState } from 'react';
import styles from "./Kolicina.module.css";

function Kolicina({value, onChange, min, max}) {
	
	const [kolicina, setKolicina] = useState(value)

	useEffect(() => {
		onChange(kolicina)
	}, [kolicina])

	function povecaj() {
		setKolicina(Math.min(Math.max(kolicina + 1, min || 1), max || 100))
	}
	function smanji() {
		setKolicina(Math.max(Math.min(kolicina - 1, max || 100), min || 1))
	}

	return (
		<div className={styles.kolicina}>
			<span>Količina: </span>
			<div className={styles.kolicina_smanji} onClick={smanji}>-</div>
			<div className={styles.kolicina_broj}>{kolicina}</div>
			<div className={styles.kolicina_povecaj} onClick={povecaj}>+</div>
		</div>
	)
}

export default Kolicina
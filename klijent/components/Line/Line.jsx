import styles from "./Line.module.css";


function Line({color, width}) {
	return (
		<div className={styles.line} style={{width}}>
			<div className={styles.line__kvadrat} style={{background: color}}/>
			<div className={styles.line__linija} style={{background: color}}/>
		</div>
	)
}

export default Line;
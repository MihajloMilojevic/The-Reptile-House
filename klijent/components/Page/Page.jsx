import styles from "./Page.module.css"

function Page({children}) {
	return (
		<div className={styles.page}>
			{children}
		</div>
	)
}

export default Page
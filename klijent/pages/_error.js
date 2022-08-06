import { GradientButton, Page, PageTitle } from "../components"
import Link from "next/link"

export default function Custom404() {
	return (
		<Page style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		}}>
			<div style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}>
				<PageTitle>Došlo je do greške</PageTitle>
				<GradientButton>
					<Link href="/">Vrati se na početnu</Link>
				</GradientButton>
			</div>
		</Page>
	)
}
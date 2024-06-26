import { useRouter } from "next/router";
import { ProductForm, PageTitle } from "../../components";
import { useStateContext } from "../../context/ContextProvider";

export default function Kreiraj() {

	const router = useRouter();
	const {createNotification, notificationTypes, setLoader} = useStateContext();

	async function onSave(formData) {
		try {
			setLoader(true);
			const body = {
				naziv: formData.naziv.value,
				cena: formData.cena.value,
				preporuceno: formData.preporuceno.checked,
				thumbnail: formData.thumbnail.value,
				slike: formData.slike.value.map(slika => slika.id),
				opis: formData.opis.value,
				duzina: formData.duzina.value,
				sirina: formData.sirina.value,
				visina: formData.visina.value,
				boje: formData.boje.value,
				dodaci: formData.dodaci.value
			}
			const res = await fetch("/api/terarijumi", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
			const json = await res.json();
			if(!json.ok) throw new Error(json.message);
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.SUCCESS,
					message: `Terarijum uspešno kreiran`
				});
				router.push("/terarijumi");
			}, 1 * 1000);
		} catch (error) {
			console.error(error)
			setTimeout(() => {
				setLoader(false);
				createNotification({
					type: notificationTypes.ERROR,
					message: error.message
				});
			}, 1 * 1000);
		}
	}

	return (
		<div>
			<PageTitle>Kreiraj terarijum</PageTitle>
			<ProductForm kategorija="terarijumi" onSave={onSave}/>
		</div>
	)
}
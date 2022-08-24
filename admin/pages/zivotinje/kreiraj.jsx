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
				vrsta: formData.vrsta.value,
				morf: formData.morf.value,
				pol: formData.pol.value,
				vreme: formData.vreme.value,
				roditelji: formData.roditelji.value,
				tezina: formData.tezina.value,
				ostecenja: formData.ostecenja.value,
			}
			const res = await fetch("/api/zivotinje", {
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
					message: `Životinja uspešno kreirana`
				});
				router.push("/zivotinje");
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
			<PageTitle>Kreiraj životinju</PageTitle>
			<ProductForm kategorija="zivotinje" onSave={onSave}/>
		</div>
	)
}
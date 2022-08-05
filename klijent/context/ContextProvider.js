import {createContext, useContext, useState, useEffect} from "react";
import useWindowSize from "../utils/hooks/useWindowSize";
import {NotificationContainer, NotificationManager} from 'react-notifications';

const StateContext = createContext();


export default function ContextProvider({children}) {
	const windowSize = useWindowSize();
	const [activeMenu, setActiveMenu] = useState(false);
	const [korpa, setKorpa] = useState([]);
	const [ukupnaCenaKorpe, setUkupnaCenaKorpe] = useState(0);

	useEffect(() => {
		setUkupnaCenaKorpe(korpa.reduce((sum, item) => (sum + item.kolicina * item.cena), 0))
	}, [korpa])

	useEffect(() => {
		const localKorpa = localStorage.getItem("korpa");
		if(localKorpa)
			setKorpa(JSON.parse(localKorpa));
	}, [])

	function promeniKorpu(newKorpa) {
		setKorpa(newKorpa);
		localStorage.setItem("korpa", JSON.stringify(korpa))
	}

	function dodajUKorpu(newItem) {
		const newKorpa = [...korpa];
		const index = newKorpa.findIndex(item => item.naziv === newItem.naziv);
		if(index < 0)
			newKorpa.push(newItem);
		else
			newKorpa[index].kolicina += newItem.kolicina;
		promeniKorpu(newKorpa)
		createNotification({
			type: notificationTypes.SUCCESS,
			message: `Uspešno ste dodali '${newItem.naziv}' u korpu.`
		})
	}

	function izbaciIzKorpe(index) {
		const item = korpa.find((_, korpaIndex) => korpaIndex === index);
		promeniKorpu(korpa.filter((_, korpaIndex) => korpaIndex !== index));
		createNotification({
			type: notificationTypes.SUCCESS,
			message: `Uspešno ste izbacili '${item.naziv}' iz korpe.`
		})
	}

	function promeniKolicinu(index, newKolicina) {
		const newKorpa = [...korpa];
		newKorpa[index].kolicina = newKolicina;
		promeniKorpu(newKorpa);
	}

	function isprazniKorpu() {
		promeniKorpu([]);
	}

	const notificationTypes = {
		INFO: "info",
		SUCCESS: "success",
		WARNING: "warning",
		ERROR: "error"
	}
	function createNotification(params) {
		const [
			message, 
			title, 
			timeout, 
			callback, 
			priority
		] = [
			params?.message ?? "",
			params?.title ?? "",
			params?.timeout ?? 5000,
			params?.callback ?? (() => {}),
			params?.priority ?? false
		]
		switch (params.type) {
			case notificationTypes.INFO:
				NotificationManager.info(message, title, timeout, callback, priority);
				break;
			case notificationTypes.SUCCESS:
				NotificationManager.success(message, title, timeout, callback, priority);
				break;
			case notificationTypes.WARNING:
				NotificationManager.warning(message, title, timeout, callback, priority);
				break;
			case notificationTypes.ERROR:
				NotificationManager.error(message, title, timeout, callback, priority);
				break;
			default:
				console.error(`${params.type} is invalid type. Try one of following: ${Object.keys(notificationTypes).join(", ")}`)
				break;
		}
	}

	return (
		<StateContext.Provider
			value={{
				windowSize,
				activeMenu, setActiveMenu,
				korpa, ukupnaCenaKorpe,
				dodajUKorpu,
				izbaciIzKorpe,
				promeniKolicinu,
				notificationTypes, createNotification
			}}
		>
			{children}
			
			<NotificationContainer/>
		</StateContext.Provider>	
	)
}

export function useStateContext() {
	return useContext(StateContext)
}
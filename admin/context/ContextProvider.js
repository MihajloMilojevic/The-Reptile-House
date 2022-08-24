import {createContext, useContext, useState, useEffect} from "react";
import useWindowSize from "../utils/hooks/useWindowSize";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useRouter } from "next/router";
import { Loader, DeleteDialog, Modal } from "../components";

const StateContext = createContext();


export default function ContextProvider({children}) {
	const router = useRouter();
	const windowSize = useWindowSize();
	const [activeMenu, setActiveMenu] = useState(true);
	const [loader, setLoader] = useState(false);
	const [loading, setLoading] = useState(true);
	const [korisnik, setKorisnik] = useState(null);
	const [navHeight, setNavHeight] = useState(0);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteDialogNaziv, setDeleteDialogNaziv] = useState("");
	const [deleteDialogOnYes, setDeleteDialogOnYes] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalChildren, setModalChildren] = useState(null);

	useEffect(() => {
		setActiveMenu(windowSize.width > 900)
	}, [windowSize])

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/showme");
				const json = await res.json();
				if(!json.ok) throw new Error(json.message);
				setKorisnik(json.korisnik);
			} catch (error) {
				console.error(error);
				router.replace("/login");
			}
			finally {
				setTimeout(() => {
					setLoading(false);
				}, 1.5 * 1000);
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const notificationTypes = {
		INFO: "info",
		SUCCESS: "success",
		WARNING: "warning",
		ERROR: "error"
	}

	function openDeleteDialog({naziv, onYes}) {
		setDeleteDialogOnYes(onYes);
		setDeleteDialogNaziv(naziv);
		setDeleteDialogOpen(true);
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
	let render = loading ? 
					<Loader show={true} /> : 
					<>
						{children}
						<Loader show={loader} />
					</>;
	return (
		<StateContext.Provider
			value={{
				windowSize,
				activeMenu, setActiveMenu,
				notificationTypes, createNotification,
				loader, setLoader,
				korisnik, setKorisnik,
				navHeight, setNavHeight,
				openDeleteDialog,
				setModalChildren, setModalOpen,
			}}
		>	
			{render}
			<NotificationContainer/>
			<DeleteDialog 
				open={deleteDialogOpen}
				setOpen={setDeleteDialogOpen}
				onYes={deleteDialogOnYes}
				naziv={deleteDialogNaziv}
			/>
			<Modal show={modalOpen}>
				{modalChildren}
			</Modal>
		</StateContext.Provider>	
	)
}

export function useStateContext() {
	return useContext(StateContext)
}
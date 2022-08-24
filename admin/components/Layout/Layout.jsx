import { useStateContext } from "../../context/ContextProvider";
import {SideBar, Footer, Navbar, ScrollToTop, Page} from "..";
import { useRouter } from "next/router";

function Layout({children}) {

	const {activeMenu, windowSize} = useStateContext();
	const router = useRouter();

	if(router.pathname === "/login")
		return children;

	return (
		<>
			<div
				style={{
					display: "flex",
					width: "100%",
					minHeight: "100vh",
					position: "relative"
				}}
			>
				{
					activeMenu ?
					<div
						style={{
							width: "18rem",
							height: "100%",
							position: "fixed",
							zIndex: 5000,
							background: "white",
							paddingBottom: "2rem"
						}}	
						className="hover-scroll box-shadow"
					>
						<SideBar />
					</div> :
					<div style={{width: 0}}>
					</div>
				}
				<div 
					style={{
						width: (windowSize.width > 900 && activeMenu)  ? "calc(100% - 18rem)" : "100%",
						height: "100%",
						position: "fixed",
						right: 0,
						overflowX: "hidden",
						zIndex: 3000
					}}
					id="content"
				>
					<Navbar />
					<Page>
						{children}
					</Page>
					<Footer />
					<ScrollToTop />
				</div>
			</div>
		</>
	)
}

export default Layout
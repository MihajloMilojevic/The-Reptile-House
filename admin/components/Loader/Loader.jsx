import {BounceLoader} from "react-spinners";

function Loader({show}) {
	if(!show)
		return <></>
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				position: "fixed",
				top: 0,
				left: 0,
				zIndex: 99999999,
				background: "rgba(200, 200, 200, 0.75)",
				width: "100vw",
				height: "100vh",
				
			}}
		>
			<BounceLoader color={"#000000"} size={100} />
		</div>
	)
}

export default Loader
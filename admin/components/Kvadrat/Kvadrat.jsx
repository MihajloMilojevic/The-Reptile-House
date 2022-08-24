
function Kvadrat({style}) {
	return (
		<div 
			style={{
				width: "10px",
				height: "10px",
				transform: "rotate(45deg)",
				background: "linear-gradient(238.66deg, #0283E9 -18.13%, #FC01CA 120.27%)",
				...style
			}}
		/>
	)
}

export default Kvadrat;
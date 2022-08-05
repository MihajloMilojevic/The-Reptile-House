import React from 'react'

function GradientButton({children, onClick}) {
	return (
		<button 
			onClick={onClick} 
			style={{
				color: "white",
				outline: "none",
				border: "none",
				borderRadius: "15px",
				padding: "1rem 1.5rem",
				fontSize: "14px",
				cursor: "pointer"
			}}
			className="gradient"
		>
			{children}
		</button>
	)
}

export default GradientButton
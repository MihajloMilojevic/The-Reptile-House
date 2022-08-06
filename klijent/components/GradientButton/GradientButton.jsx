import React from 'react'

function GradientButton({children, onClick, style, ...rest}) {
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
				cursor: "pointer",
				...style
			}}
			className="gradient"
			{...rest}
		>
			{children}
		</button>
	)
}

export default GradientButton
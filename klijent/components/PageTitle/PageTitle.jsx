import React from 'react'

function PageTitle({children, style}) {
	return (
		<h1 style={{
			fontSize: 34,
			textAlign:"center",
			margin: "auto",
			marginBottom: "2rem",
			fontWeight: "bolder",
			width: "100%",
			...style
		}} className="gradient_text">
			{children}
		</h1>
	)
}

export default PageTitle
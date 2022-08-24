/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'

function Test() {

	const inputRef = useRef(null);

	return (
		<div>
			<form
				onSubmit={async e => {
					e.preventDefault();
					try {	
						const body  = new FormData();
						Array.from(inputRef.current.files).forEach((file, index) => body.append("image"+index, file))
						body.append("kategorija", "terarijumi");
						const res = await fetch("http://localhost:10000/api/upload", {
							method: "POST",
							body
						})
						const json = await res.json();
						alert(JSON.stringify(json))
					}
					catch(error) {
						alert(error.message)
					} 
				}}
			>
				<input multiple name="test" type="file" ref={inputRef} />
				<button type="submit">POSALJI</button>
			</form>
			<img width={100} height={100} style={{objectFit: "contain"}} alt="TEST" src='/images/d6e747cbffb9e0b30e7f.JPG' />
		</div>
	)
}

export default Test
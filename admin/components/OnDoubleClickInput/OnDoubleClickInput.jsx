import { useEffect, useState } from 'react';
import { GradientButton } from "..";

function OnDubleClickInput({value, onConfirm, style, renderText, ...rest}) {

	const [showInput, setShowInput] = useState(false);
	const [inputValue, setInputValue] = useState(value);

	useEffect(() => {
		setInputValue(value)
	}, [value])

	return showInput ? (
		<div 
			style={{
				flex: 1,
				display: "flex",
				flexWrap: "wrap",
				justifyContent: "space-between",
				alignItems: "center",
				gap: "0.5rem"
			}}
			{...rest}
		>
			<input 
				value={inputValue} 
				onChange={e => setInputValue(e.target.value)} 
				style={{
					flex: 1,
					outline: "none",
					border: "1px solid black",
					borderRadius: "7.5px",
					padding: "0.75rem",
				}}
			/>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "0.75rem"
				}}
			>
				<GradientButton 
					onClick={() => {onConfirm(inputValue); setShowInput(false); setInputValue(value)}}
				>
					Sačuvaj
				</GradientButton>
				<GradientButton 
					style={{background: "white", color: "black"}}
					className="box-shadow"
					onClick={() => {setShowInput(false); setInputValue(value)}}
				>
					Odbaci
				</GradientButton>
			</div>
		</div>
	) : (
		<div
			onClick={e => {if(e.detail >= 2) setShowInput(true)}}
			style={{
				...style
			}}
			{...rest}
		>
			{renderText ? renderText?.(value) : (
				<b>
					{value}
				</b>
			)}
		</div>
	)
}

export default OnDubleClickInput

import { useEffect, useState } from "react";
import styles from "./Slider.module.css";
import { useStateContext } from "../../context/ContextProvider";

function Slider({slides}) {
	
	const {windowSize} = useStateContext()
	const [currentSlide, setCurrentSlide] = useState(0);
	const [imgSize, setImgSize] = useState(Math.min(windowSize.width - 100, 500));


	useEffect(() => {
		setImgSize(Math.min(windowSize.width - 100, 500))
	}, [windowSize])

	// // Next/previous controls
	function next() {
		setCurrentSlide(prevCurrentSlide => ((prevCurrentSlide + 1) % slides.length))
	}
	
	function prev() {
		setCurrentSlide(prevCurrentSlide => ((prevCurrentSlide - 1 + slides.length) % slides.length))
	}

	return (
		<div className={styles.slider}>
			<div className={styles.slider_container}>

				{
					slides.map((image, index) => {
						
						return (
							<div 
								className={`${styles.slider_slide} ${styles.slider_fade}`} 
								key={index}
								style={{
									display: currentSlide === index ? "block" : "none",
									width: imgSize,
									height: imgSize
								}}
							>
								<img {...image} />
							</div>
						)
					})
				}

				<div className={styles.slider_prev} onClick={prev}>❮</div>
				<div className={styles.slider_next} onClick={next}>❯</div>

			</div>

			<div style={{textAlign: "center"}}>
				{
					slides.map((_, index) => (
						<span 
							key={index}
							className={`${styles.slider_dot} ${currentSlide === index ? styles.slider_active : ""}`} 
							onClick={() => setCurrentSlide(index)}
						/>
					))
				} 
			</div>
		</div>
	)
}

export default Slider;


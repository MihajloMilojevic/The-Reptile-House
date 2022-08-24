import * as React from "react";
import styles from "./DragDropFile.module.css"

export default function DragDropFile({inputRef}) {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
	if (e.dataTransfer.files) {
		inputRef.current.files = e.dataTransfer.files;
	}
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form
      className={styles["form-file-upload"]}
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        className={styles["input-file-upload"]}
        multiple={true}
        onChange={handleChange}
      />
      <label
        htmlFor="input-file-upload"
        className={`${styles["label-file-upload"]} ${dragActive ? "drag-active" : ""}`}
      >
        <div>
          <p style={{padding: "1rem"}}>Prevucite i otpustite svoje datoteke ovde ili</p>
          <button className={styles["upload-button"]} onClick={onButtonClick}>
		  	Otpremite datoteku
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          className={styles["drag-file-element"]}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
}

import {forwardRef, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {GradientButton} from ".."

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
  });
  
function DeleteDialog({naziv, onYes, open, setOpen}) {
	return (
		<Dialog
			open={open}
			style={{zIndex: 9999999}}
		>
			<DialogTitle>{"Upozorenje!!!"}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{`Da li ste sigurni da želite trajno da obrišete '${naziv}'?`}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<GradientButton onClick={() => {setOpen(false)}} autoFocus style={{background: "white", color: "black"}} className="box-shadow">NE</GradientButton>
				<GradientButton onClick={async () => { await onYes?.(); setOpen(false)}}>DA</GradientButton>
			</DialogActions>
		</Dialog>
	)
}

export default DeleteDialog
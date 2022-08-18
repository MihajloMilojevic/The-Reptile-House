import nc from "next-connect";
import StatusCodes from "http-status-codes";
import nodemailer from "nodemailer";

const handler = nc({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message: `Došlo je do greške`, error: err});
	},
	onNoMatch: (req, res) => {
		res.status(StatusCodes.NOT_FOUND).json({ok: false, message: `${req.method} ${req.url} ne postoji`});
	},
})
handler.post(async (req, res) => {
	const {mejl, ime, poruka } = req.body;
	if(!mejl || !ime || !poruka)
		return res.status(StatusCodes.BAD_REQUEST).json({ok: false, message: "Ime, mejl i poruka su obavezni"});
	const transporter = nodemailer.createTransport({
		host: "thereptilehouse.rs",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.MAIL_USER, // generated ethereal user
			pass: process.env.MAIL_PASSWORD // generated ethereal password
		},
	});
	const data = await transporter.sendMail({
		from: `The reptile house <${process.env.MAIL_USER}>`, // sender address
		to: "thereptilehouse.info@gmail.com", // list of receivers
		subject: `Pitanje sa sajta - ${ime}`, // Subject line
		text: `${mejl}\n ${poruka}`, // plain text body
		html: `	<p><b>Ime</b>: ${ime}</p>
				<p><b>Mejl</b>: <a href="mailto:${mejl}">${mejl}</a></p>
				<p><b>Poruka</b>: ${poruka}</p>		
		`, // html body
	});
	res.status(StatusCodes.CREATED).json({ok: true, data});
})

export default handler;
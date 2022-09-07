import nc from "next-connect";
import StatusCodes from "http-status-codes";
import nodemailer from "nodemailer";
import {poruci, jednaPorudzbina} from "../../database/porudzbine";

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
	const id = await poruci(req.body);
	const porudzbina = await jednaPorudzbina(id);
	
	const transporter = nodemailer.createTransport({
		host: "thereptilehouse.rs",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.MAIL_USER, // generated ethereal user
			pass: process.env.MAIL_PASSWORD // generated ethereal password
		},
	});

	await transporter.sendMail({
		from: `The reptile house <${process.env.MAIL_USER}>`, // sender address
		to: "thereptilehouse.info@gmail.com", // list of receivers
		subject: `Nova porudžbina`, // Subject line
		text: `Stigla je nova porudžbina. Pogledaj na linku https://admin.thereptilehouse.rs/porudzbine/${id}`, // plain text body
		html: `	<h1>Stigla je nova poružbina</h1>
				<p>Pregledaj porudžbinu na sledećem linku: <a href='https://admin.thereptilehouse.rs/porudzbine/${id}'>https://admin.thereptilehouse.rs/porudzbine/${id}</a></p>	
		`, // html body
	});
	
	const [text, html] = mailPorudzbinaKlijent(porudzbina);
	await transporter.sendMail({
		from: `The reptile house <${process.env.MAIL_USER}>`, // sender address
		to: req.body.mejl, // list of receivers
		subject: `Potvrda porudžbine`, // Subject line
		text,
		html 
	});

	res.status(StatusCodes.OK).json({ok: true});
})

function mailPorudzbinaKlijent(porudzbina) {	
	const proizodi = porudzbina.proizvodi.map(item => mailProizvod(item));
	const textProizvodi = proizodi.map(el => el[0]).join("\n\xA0");
	const htmlProizvodi = proizodi.map(el => el[1]).join("<hr>");
	const text = 
	`
		Uspešno ste izvršili porudžbinu.
		Proizvodi: \n${textProizvodi}
		Ukupna cena: ${porudzbina.cena}
	`;
	const html = 
	`
		<h1>Uspešno ste izvršili porudžbinu.</h1>
		<p>Proizvodi:</p>
		<div style='display: "flex"; flex-direction: "column";'>
			${htmlProizvodi}
		</div>
		<h3>Ukupna cena: ${porudzbina.cena} din.</h3>
	`
	return [text, html];
}

function mailProizvod(props) {
	return (
		[
			`
				Naziv: ${props.naziv} ${props.natpis ? `\n\xA0\t\t\t\tNatpis: "${props.natpis}"` : ""}
				Količina: ${props.kolicina} 
				Cena: ${props.cena}din.
			`,
			`
				<div>
					<h3>${props.naziv}</h3>
					<p>Količina: ${props.kolicina}</p>
					${props.natpis ? `<p>Natpis: "${props.natpis}"</p>` : ""}
					<p>Cena: ${props.cena} din.</p>
				</div>
			`
		]
	)
}

export default handler;
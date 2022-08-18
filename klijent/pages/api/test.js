import nc from "next-connect";
import mysql from "../../database";
import doplate from "../../database/doplate";

const handler = nc({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(500).json({ok: false, message: `Došlo je do greške`, error: err});
	},
	onNoMatch: (req, res) => {
		res.status(404).json({ok: false, message: `${req.method} ${req.url} ne postoji`});
	},
})

handler.get(async (req, res) => {
	// const data = await mysql.query("INSERT INTO porudzbine(id, ime, prezime, mejl, adresa, telefon) VALUES('8575a7ede0b3e4a3e361', 'Mihajlo', 'Milojević', 'milojevicm374@gmail.com', '8. mart 70', '0649781191'); CALL dodaj_proizvod_porudzbina('6e9nl6xljm6f', '8575a7ede0b3e4a3e361', '5', '#000000', '');  CALL dodaj_proizvod_porudzbina('6e9nl6xljm6f', '8575a7ede0b3e4a3e361', '1', '#ff0000', '');  CALL dodaj_proizvod_porudzbina('6e9nl6xljm6f', '8575a7ede0b3e4a3e361', '2', '#000000', 'Samo natpis');  CALL dodaj_proizvod_porudzbina('6e9nl6xljm6f', '8575a7ede0b3e4a3e361', '3', '#00ff00', 'Natpis i boja');")
	res.status(200).json({ok: true});
})

export default handler;
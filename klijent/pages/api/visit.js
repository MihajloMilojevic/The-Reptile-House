import nc from "next-connect";
import {dodajPosetu} from "../../database/visit";

const handler = nc({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(500).json({ok: false, message: `Došlo je do greške`, error: err});
	},
	onNoMatch: (req, res) => {
		res.status(404).json({ok: false, message: `${req.method} ${req.url} ne postoji`});
	},
})

handler.post(async (req, res) => {
	dodajPosetu(req.body.url);
	res.status(200).json({ok: true});
})

export default handler;
import nc from "next-connect";
import StatusCodes from "http-status-codes";
import poruci from "../../database/porudzbine";

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
	const data = await poruci(req.body);
	res.status(StatusCodes.OK).json({ok: true, data});
})

export default handler;
import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { obrisiDodatak, promeniDodatak, sviDodaci } from "../../../database/controllers/dodaci";
import auth from "../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})

handler.get(errorWraper(async (req, res) => {
	const data = await sviDodaci();
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.patch(errorWraper(async (req, res) => {
	const data = await promeniDodatak(req.body.stariNaziv, req.body.noviNaziv);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.delete(errorWraper(async (req, res) => {
	const data = await obrisiDodatak(req.body.naziv);
	console.log(req.body)
	res.status(StatusCodes.OK).json({ok: true, data});
}))

export default handler;
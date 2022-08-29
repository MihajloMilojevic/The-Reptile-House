import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { promeniCenu, sveDoplate } from "../../../database/controllers/doplate";
import auth from "../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})

handler.get(errorWraper(async (req, res) => {
	const data = await sveDoplate();
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.patch(errorWraper(async (req, res) => {
	const data = await promeniCenu(req.body.cena, req.body.naziv);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

export default handler;
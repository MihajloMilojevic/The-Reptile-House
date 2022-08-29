import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { azurirajOpremu, jednaOprema, obrisiOpremu } from "../../../database/controllers/oprema";
import auth from "../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})

handler.get(errorWraper(async (req, res) => {
	const data = await jednaOprema(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.delete(errorWraper(async (req, res) => {
	const data = await obrisiOpremu(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.patch(errorWraper(async (req, res) => {
	const data = await azurirajOpremu(req.body);
	res.status(StatusCodes.CREATED).json({ok: true, data});
}))

export default handler;
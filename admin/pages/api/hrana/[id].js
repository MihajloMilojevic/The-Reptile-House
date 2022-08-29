import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { azurirajHranu, jednaHrana, obrisiHranu } from "../../../database/controllers/hrana";
import auth from "../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})

handler.get(errorWraper(async (req, res) => {
	const data = await jednaHrana(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.delete(errorWraper(async (req, res) => {
	const data = await obrisiHranu(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.patch(errorWraper(async (req, res) => {
	const data = await azurirajHranu(req.body);
	res.status(StatusCodes.CREATED).json({ok: true, data});
}))

export default handler;
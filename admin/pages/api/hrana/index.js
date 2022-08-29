import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { kreirajHranu, svaHrana } from "../../../database/controllers/hrana";
import auth from "../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})

handler.get(errorWraper(async (req, res) => {
	const data = await svaHrana();
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.post(errorWraper(async (req, res) => {
	await kreirajHranu(req.body);
	res.status(StatusCodes.CREATED).json({ok: true})
}))


export default handler;
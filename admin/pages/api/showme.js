import nc from "next-connect";
import errorWrapper from "../../middleware/errorWrapper";
import auth from "../../middleware/authentication";
import { StatusCodes } from "http-status-codes";
import Errors from "../../errors";

const handler = nc({
	onNoMatch: errorWrapper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.get(errorWrapper(async (req, res) => {
	const korisnik = await auth(req, res);
	res.status(StatusCodes.OK).json({ok: true, korisnik})
}))

export default handler;

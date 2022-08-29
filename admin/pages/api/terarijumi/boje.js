import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { dodajBoju } from "../../../database/controllers/terarijumi";
import auth from "../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})
handler.post(errorWraper(async (req, res) => {
	const id = await dodajBoju(req.body.hex);
	res.status(StatusCodes.OK).json({ok: true, id});
}))

export default handler;
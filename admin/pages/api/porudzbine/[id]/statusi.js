import nc from "next-connect";
import errorWraper from "../../../../middleware/errorWrapper";
import Errors from "../../../../errors";
import { StatusCodes } from "http-status-codes";
import { promeniStatus } from "../../../../database/controllers/porudzbine";
import auth from "../../../../middleware/authentication";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(async (req, res, next) => {
	await auth(req, res);
	next()
})

handler.patch(errorWraper(async (req, res) => {
	const data = await promeniStatus(req.query.id, req.body.status);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

export default handler;
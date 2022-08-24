import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { slikePoKategoriji } from "../../../database/controllers/slike";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});


handler.get(errorWraper(async (req, res) => {
	const data = await slikePoKategoriji(req.query.kategorija);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

export default handler;
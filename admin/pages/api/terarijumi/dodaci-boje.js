import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { getDodaciBoje } from "../../../database/controllers/terarijumi";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.get(errorWraper(async (req, res) => {
	const data = await getDodaciBoje();
	res.status(StatusCodes.OK).json({ok: true, data});
}))

export default handler;
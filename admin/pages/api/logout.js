import nc from "next-connect";
import errorWraper from "../../middleware/errorWrapper";
import Errors from "../../errors";
import { setCookie } from "cookies-next";
import { StatusCodes } from "http-status-codes";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.get(errorWraper(async (req, res) => {
	setCookie("token", null, {	req, res, httpOnly: true, expires: new Date(Date.now() + 10 * 1000)});
	res.status(StatusCodes.OK).json({ok: true})
}))

export default handler;
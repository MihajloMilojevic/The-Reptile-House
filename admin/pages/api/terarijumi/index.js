import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { kreirajTerarijum, sviTerarijumi } from "../../../database/controllers/terarijumi";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.get(errorWraper(async (req, res) => {
	const data = await sviTerarijumi();
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.post(errorWraper(async (req, res) => {
	await kreirajTerarijum(req.body);
	res.status(StatusCodes.CREATED).json({ok: true})
}))

export default handler;
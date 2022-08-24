import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { azurirajTerarijum, jedanTerarijum, obrisiTerarijum } from "../../../database/controllers/terarijumi";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});


handler.get(errorWraper(async (req, res) => {
	const data = await jedanTerarijum(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.delete(errorWraper(async (req, res) => {
	const data = await obrisiTerarijum(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.patch(errorWraper(async (req, res) => {
	const data = await azurirajTerarijum(req.body);
	res.status(StatusCodes.CREATED).json({ok: true, data});
}))

export default handler;
import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { azurirajZivotinju, jednaZivotinja, obrisiZivotinju } from "../../../database/controllers/zivotinje";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});


handler.get(errorWraper(async (req, res) => {
	const data = await jednaZivotinja(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.delete(errorWraper(async (req, res) => {
	const data = await obrisiZivotinju(req.query.id);
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.patch(errorWraper(async (req, res) => {
	const data = await azurirajZivotinju(req.body);
	res.status(StatusCodes.CREATED).json({ok: true, data});
}))

export default handler;
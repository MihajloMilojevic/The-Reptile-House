import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { kreirajZivotinju, sveZivotinje } from "../../../database/controllers/zivotinje";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.get(errorWraper(async (req, res) => {
	const data = await sveZivotinje();
	res.status(StatusCodes.OK).json({ok: true, data});
}))

handler.post(errorWraper(async (req, res) => {
	await kreirajZivotinju(req.body);
	res.status(StatusCodes.CREATED).json({ok: true})
}))


export default handler;
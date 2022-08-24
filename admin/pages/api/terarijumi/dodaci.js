import nc from "next-connect";
import errorWraper from "../../../middleware/errorWrapper";
import Errors from "../../../errors";
import { StatusCodes } from "http-status-codes";
import { dodajDodatak } from "../../../database/controllers/terarijumi";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.post(errorWraper(async (req, res) => {
	const id = await dodajDodatak(req.body.naziv);
	console.log(id)
	res.status(StatusCodes.OK).json({ok: true, id: id});
}))

export default handler;
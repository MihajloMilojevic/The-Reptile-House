import nc from "next-connect";
import errorWraper from "../../middleware/errorWrapper";
import Errors from "../../errors";
import { setCookie } from "cookies-next";
import { pronadjiKorisnikaPoMejlu } from "../../database/controllers/korisnici";
import { kreirajToken, uporediLozinke } from "../../utils/korisnici";
import { StatusCodes } from "http-status-codes";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.post(errorWraper(async (req, res) => {
	const {mejl, lozinka} = req.body;
	if(!mejl) throw new Errors.BadRequestError("Mejl je obavezan");
	if(!lozinka) throw new Errors.BadRequestError("Lozinka je obavezna");
	const korisnik = await pronadjiKorisnikaPoMejlu(mejl);
	if(!korisnik) throw new Errors.BadRequestError("Korisnik ne postoji");
	const tacnaLozinka = await uporediLozinke(lozinka, korisnik.lozinka);
	if(!tacnaLozinka) throw new Errors.BadRequestError("Pogrešna lozinka");
	const token = kreirajToken(korisnik);
	setCookie("token", token, {	req, res, httpOnly: true})
	res.status(StatusCodes.OK).json({ok: true, korisnik: {mejl: korisnik.mejl, ime: korisnik.ime, prezime: korisnik.prezime}})
}))

export default handler;
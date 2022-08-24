import nc from "next-connect";
import errorWraper from "../../middleware/errorWrapper";
import auth from "../../middleware/authentication";
import Errors from "../../errors";
import { promeniLozinku, pronadjiKorisnikaPoMejlu } from "../../database/controllers/korisnici";
import { uporediLozinke } from "../../utils/korisnici";
import { StatusCodes } from "http-status-codes";

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.post(errorWraper(async (req, res) => {
	const {stara, nova, potvrda} = req.body;
	if(!stara) throw new Errors.BadRequestError("Stara lozinka je obavezna");
	if(!nova) throw new Errors.BadRequestError("Nova lozinka je obavezna");
	if(!potvrda) throw new Errors.BadRequestError("Potrda nove lozinke je obavezna");
	if(nova !== potvrda) throw new Errors.BadRequestError("Lozinke se ne podudaraju");
	const user = await auth(req, res);
	if(!user) throw new Errors.BadRequestError("Morate biti prijavljeni da bi promenili lozinku");
	const korisnik = await pronadjiKorisnikaPoMejlu(user.mejl);
	if(!korisnik) throw new Errors.BadRequestError("Korisnik ne postoji");
	const tacnaLozinka = await uporediLozinke(stara, korisnik.lozinka);
	if(!tacnaLozinka) throw new Errors.BadRequestError("Pogrešna lozinka");
	const info = await promeniLozinku(korisnik.mejl, nova);
	res.status(StatusCodes.OK).json({ok: true, info})
}))

export default handler;
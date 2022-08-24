import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export async function hash(lozinka){
	const salt = await bcryptjs.genSalt(10)
	let hashed = await bcryptjs.hash(lozinka, salt)
	return hashed;
}

export async function uporediLozinke(lozinka, hash) {
	const iste = await bcryptjs.compare(lozinka, hash)
	return iste;
}

export function kreirajToken(korisnik) {
	const sadrzaj = {mejl: korisnik.mejl, ime: korisnik.ime, prezime: korisnik.prezime};
	return jwt.sign(
		sadrzaj,
		process.env.JWT_SECRET
	)
}

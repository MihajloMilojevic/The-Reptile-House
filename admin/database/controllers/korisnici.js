const mysql = require("..");
const { hash } = require("../../utils/korisnici");

async function pronadjiKorisnikaPoMejlu(mejl) {
	const data = await mysql.query("SELECT * FROM korisnici WHERE mejl = ?", [mejl]);
	await mysql.end();
	if(!data || !data.length) return null;
	return data[0];
}

async function promeniLozinku(mejl, lozinka) {
	const hashed = await hash(lozinka);
	const data = await mysql.query("UPDATE korisnici SET lozinka = ? WHERE mejl = ?", [hashed, mejl]);
	await mysql.end();
	return data;
}

module.exports = {
	pronadjiKorisnikaPoMejlu,
	promeniLozinku
}
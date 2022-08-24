const mysql = require("..");
const { hash } = require("../../utils/korisnici");

async function pronadjiKorisnikaPoMejlu(mejl) {
	const sql = `SELECT * FROM korisnici WHERE mejl = '${mejl}'`;
	const data = await mysql.query(sql);
	await mysql.end();
	if(!data || !data.length) return null;
	return data[0];
}

async function promeniLozinku(mejl, lozinka) {
	const hashed = await hash(lozinka);
	const sql = `UPDATE korisnici SET lozinka = '${hashed}' WHERE mejl = '${mejl}'`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

module.exports = {
	pronadjiKorisnikaPoMejlu,
	promeniLozinku
}
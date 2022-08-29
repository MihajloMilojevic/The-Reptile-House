const mysql = require("..");

async function sviDodaci() {
	const sql = "SELECT * FROM dodaci"
	let data = await mysql.query(sql)
	await mysql.end();
	return data;
}

async function promeniDodatak(stariNaziv, noviNaziv) {
	const data = await mysql.query(
		"UPDATE dodaci SET naziv = ? WHERE naziv = ?",
		[
			noviNaziv,
			stariNaziv
		]
	);
	await mysql.end();
	return data;
}

async function obrisiDodatak(naziv) {
	const data = await mysql.query(
		"DELETE FROM dodaci WHERE naziv = ?",
		[
			naziv
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	sviDodaci,
	promeniDodatak,
	obrisiDodatak,
};


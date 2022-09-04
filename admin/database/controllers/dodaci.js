const mysql = require("..");

async function sviDodaci() {
	const sql = "SELECT json_dodatak(id) as json FROM dodaci"
	let data = await mysql.query(sql)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))	
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

async function dodajDodatak(naziv, proizvod_id) {
	const data = await mysql.query("INSERT INTO dodaci(naziv, proizvod_id) VALUES (?, ?)", [naziv, proizvod_id]);
	await mysql.end();
	return data.insertId;
}


module.exports = {
	sviDodaci,
	promeniDodatak,
	obrisiDodatak,
	dodajDodatak,
};


const mysql = require("..");

async function svePorudzbine() {
	let data = await mysql.query(`SELECT *, ( SELECT naziv FROM statusi s WHERE s.id = p.status_id ) AS status, ( SELECT SUM(pp.kolicina * pp.cena) FROM proizvodi_porudzbine pp WHERE pp.porudzbina_id = p.id ) as cena FROM porudzbine p ORDER BY p.datum DESC;`)
	await mysql.end();
	return data
}

async function jednaPorudzbina(id) {
	let data = await mysql.query(`SELECT *, ( SELECT naziv FROM statusi s WHERE s.id = p.status_id ) AS status, ( SELECT SUM(pp.kolicina * pp.cena) FROM proizvodi_porudzbine pp WHERE pp.porudzbina_id = p.id ) as cena FROM porudzbine p WHERE p.id = ?`, [id])
	await mysql.end();
	let proizvodi = await mysql.query(`SELECT json FROM porudzbine_proizvodi WHERE porudzbina_id = ?`, [id]);
	await mysql.end();
	return {...data[0], proizvodi: proizvodi.map(el => JSON.parse(el.json))};
}

async function promeniStatus(id, status) {
	const data = await mysql.query(
		"UPDATE porudzbine SET status_id = (SELECT id FROM statusi WHERE naziv = ?) WHERE id = ?",
		[
			status,
			id
		]
	);
	await mysql.end();
	return data;
}

async function promeniIdPosiljke(id, posiljka_id) {
	const data = await mysql.query(
		"UPDATE porudzbine SET posiljka_id = ? WHERE id = ?",
		[
			posiljka_id,
			id
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	svePorudzbine,
	jednaPorudzbina,
	promeniStatus,
	promeniIdPosiljke,
}
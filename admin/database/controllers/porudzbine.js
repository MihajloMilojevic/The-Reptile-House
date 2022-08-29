const mysql = require("..");

async function svePorudzbine() {
	let data = await mysql.query(`SELECT * FROM porudzbine_json`)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jednaPorudzbina(id) {
	let data = await mysql.query(`SELECT * FROM porudzbine_json WHERE id = ?`, [id])
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
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
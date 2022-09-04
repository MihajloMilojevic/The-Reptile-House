const mysql = require(".");

async function preporuceno() {
	const sql = "SELECT CASE k.naziv WHEN 'terarijumi' THEN json_terarijum(p.id) WHEN 'zivotinje' THEN json_zivotinja(p.id) WHEN 'hrana' THEN json_hrana(p.id) ELSE json_oprema(p.id) END AS json FROM proizvodi p JOIN kategorije k ON p.kategorija_id = k.id WHERE p.preporuceno IS TRUE ORDER BY p.kategorija_id, p.naziv;"
	let data = await mysql.query(sql)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))
	return data;
}

module.exports = preporuceno;


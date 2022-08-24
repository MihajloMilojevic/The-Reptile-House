const mysql = require(".");

async function kreirajSliku(src, kategorija) {
	const sql = `INSERT INTO slike(src, kategorija_id) VALUES ('${src}', (SELECT id FROM kategorije WHERE naziv = '${kategorija}'))`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

module.exports = {
	kreirajSliku
}
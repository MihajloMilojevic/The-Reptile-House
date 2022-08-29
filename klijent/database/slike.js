const mysql = require(".");
const fs = require("fs");
const path = require("path")

async function kreirajSliku(src, kategorija) {
	const sql = `INSERT INTO slike(src, kategorija_id) VALUES ('${src}', (SELECT id FROM kategorije WHERE naziv = '${kategorija}'))`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function obrisiSliku(src) {
	console.log("obrisiSliku start")
	const imagePath = path.join(__dirname, "../../../../public", src);
	const sql = `DELETE FROM slike WHERE src = '${src}'`;
	const data = await mysql.query(sql);
	console.log({data, type: typeof data})
	await mysql.end();
	fs.unlinkSync(imagePath);
	console.log("slika obrisana iz public foldera")
	console.log("slika obrisana iz baze")
	return data;
}

module.exports = {
	kreirajSliku,
	obrisiSliku
}
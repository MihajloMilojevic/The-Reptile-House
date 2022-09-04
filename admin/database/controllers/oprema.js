const mysql = require("..");
const { uid } = require("uid");
const { spojiSlike } = require("./slike");

async function svaOprema() {
	let data = await mysql.query(`SELECT * FROM oprema`)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jednaOprema(id) {
	let data = await mysql.query(`SELECT * FROM oprema WHERE id = ?`, [id])
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiOpremu(id) {
	const data = await mysql.query("DELETE FROM proizvodi WHERE id = ?", [id]);
	await mysql.end();
	return data;
}

async function kreirajOpremu({naziv, cena, preporuceno, opis, slike, thumbnail, duzina, sirina, visina}) {
	const id = uid(20);
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const data = await mysql.query(
		"INSERT INTO proizvodi(id, naziv, cena, preporuceno, opis, thumbnail, kategorija_id, duzina, sirina, visina) VALUES " +
		"( ?, ?, ?, ?, ?, (SELECT id FROM slike WHERE src = ?), (SELECT id FROM kategorije WHERE naziv = 'oprema'), ?, ?, ?); " + 
		slikeSql,
		[
			id,
			naziv,
			cena,
			Boolean(preporuceno),
			opis,
			thumbnail,
			duzina,
			sirina,
			visina,
			...slikeParams
		]
	);
	await mysql.end();
	return data;
}

async function azurirajOpremu({id, naziv, cena, preporuceno, opis, slike, thumbnail, duzina, sirina, visina}) {
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const data = await mysql.query(
		"UPDATE proizvodi SET " +
		"naziv = ?, cena = ?, preporuceno = ?, opis = ?, thumbnail = (SELECT id FROM slike WHERE src = ?), duzina = ?, sirina = ?, visina = ? WHERE id = ?; " +
		"DELETE FROM proizvodi_slike WHERE proizvod_id = ?; " +
		slikeSql,
		[
			naziv,
			cena,
			Boolean(preporuceno),
			opis,
			thumbnail,
			duzina,
			sirina,
			visina,
			id,
			id,
			...slikeParams
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	svaOprema,
	jednaOprema,
	obrisiOpremu,
	kreirajOpremu,
	azurirajOpremu
}
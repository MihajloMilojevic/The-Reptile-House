const mysql = require("..");
const {uid} = require("uid")
const {spojiSlike} = require("./slike")

async function svaHrana() {
	let data = await mysql.query(`SELECT * FROM hrana`)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jednaHrana(id) {
	let data = await mysql.query(`SELECT * FROM hrana WHERE id = ?`, [id])
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiHranu(id) {
	const sql = `DELETE FROM proizvodi WHERE id = ?`;
	const data = await mysql.query(sql, [id]);
	await mysql.end();
	return data;
}

async function kreirajHranu({naziv, cena, preporuceno, opis, slike, thumbnail}) {
	const id = uid(20);
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const sql = `INSERT INTO proizvodi(id, naziv, cena, preporuceno, opis, thumbnail, kategorija_id) VALUES`;
	const data = await mysql.query(
		"INSERT INTO proizvodi(id, naziv, cena, preporuceno, opis, thumbnail, kategorija_id) VALUES " +
		"(?, ?, ?, ?, ?,(SELECT id FROM slike WHERE src = ?), (SELECT id FROM kategorije WHERE naziv = 'hrana')); " +
		slikeSql, 
		[
			id,
			naziv,
			cena,
			Boolean(preporuceno),
			opis,
			thumbnail,
			...slikeParams
		]
	);
	await mysql.end();
	return data;
}

async function azurirajHranu({id, naziv, cena, preporuceno, opis, slike, thumbnail}) {
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const data = await mysql.query(
		"UPDATE proizvodi SET " +
		"naziv = ?, cena = ?, preporuceno = ?, opis = ?, thumbnail = (SELECT id FROM slike WHERE src = ?) WHERE id = ?; " +
		"DELETE FROM proizvodi_slike WHERE proizvod_id = ?; " +
		slikeSql,
		[
			naziv,
			cena,
			Boolean(preporuceno),
			opis,
			thumbnail,
			id,
			id,
			...slikeParams
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	svaHrana,
	jednaHrana,
	obrisiHranu,
	kreirajHranu,
	azurirajHranu
}
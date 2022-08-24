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
	let data = await mysql.query(`SELECT * FROM oprema WHERE id = '${id}'`)
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiOpremu(id) {
	const sql = `DELETE FROM proizvodi WHERE id = '${id}'`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function kreirajOpremu({naziv, cena, preporuceno, opis, slike, thumbnail}) {
	const id = uid(20);
	const sql = `INSERT INTO proizvodi(id, naziv, cena, preporuceno, opis, thumbnail, kategorija_id) VALUES ('${id}','${naziv}','${cena}',${preporuceno ? "TRUE" : "FALSE"},'${opis}',(SELECT id FROM slike WHERE src = '${thumbnail}'), (SELECT id FROM kategorije WHERE naziv = 'oprema')); ${spojiSlike(id, slike)}`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function azurirajOpremu({id, naziv, cena, preporuceno, opis, slike, thumbnail}) {
	const sql = `UPDATE proizvodi SET naziv = '${naziv}', cena = '${cena}', preporuceno = ${preporuceno ? "TRUE" : "FALSE"}, opis = '${opis}', thumbnail = (SELECT id FROM slike WHERE src = '${thumbnail}') WHERE id = '${id}'; DELETE FROM proizvodi_slike WHERE proizvod_id = '${id}'; ${spojiSlike(id, slike)}`;
	const data = await mysql.query(sql);
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
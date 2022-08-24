const mysql = require("..");
const {uid} = require("uid")
const {spojiSlike} = require("./slike")


async function sveZivotinje() {
	let data = await mysql.query(`SELECT * FROM zivotinje`)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jednaZivotinja(id) {
	let data = await mysql.query(`SELECT * FROM zivotinje WHERE id = '${id}'`)
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiZivotinju(id) {
	const sql = `DELETE FROM proizvodi WHERE id = '${id}'`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function kreirajZivotinju({naziv, cena, preporuceno, slike, thumbnail, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja}) {
	const id = uid(20);
	const sql = `INSERT INTO proizvodi(id, naziv, cena, preporuceno, thumbnail, kategorija_id, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja) VALUES ('${id}','${naziv}','${cena}',${preporuceno ? "TRUE" : "FALSE"}, (SELECT id FROM slike WHERE src = '${thumbnail}'), (SELECT id FROM kategorije WHERE naziv = 'zivotinje'), '${vrsta}', '${morf}', '${pol}', '${vreme}', '${roditelji}', '${tezina}', '${ostecenja}'); ${spojiSlike(id, slike)}`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function azurirajZivotinju({id, naziv, cena, preporuceno, slike, thumbnail, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja}) {
	const sql = `UPDATE proizvodi SET naziv = '${naziv}', cena = '${cena}', preporuceno = ${preporuceno ? "TRUE" : "FALSE"}, thumbnail = (SELECT id FROM slike WHERE src = '${thumbnail}'), vrsta = '${vrsta}', morf = '${morf}', pol = '${pol}', vreme = '${vreme}', roditelji = '${roditelji}', tezina = '${tezina}', ostecenja = '${ostecenja}' WHERE id = '${id}'; DELETE FROM proizvodi_slike WHERE proizvod_id = '${id}'; ${spojiSlike(id, slike)}`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

module.exports = {
	sveZivotinje,
	jednaZivotinja,
	obrisiZivotinju,
	kreirajZivotinju,
	azurirajZivotinju
}
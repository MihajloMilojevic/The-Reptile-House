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
	let data = await mysql.query(`SELECT * FROM zivotinje WHERE id = ?`, [id])
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiZivotinju(id) {
	const sql = `DELETE FROM proizvodi WHERE id = ?`;
	const data = await mysql.query(sql, [id]);
	await mysql.end();
	return data;
}

async function kreirajZivotinju({naziv, cena, preporuceno, slike, thumbnail, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja}) {
	const id = uid(20);
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const data = await mysql.query(
		"INSERT INTO proizvodi(id, naziv, cena, preporuceno, thumbnail, kategorija_id, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja) VALUES " + 
		"(?,?,?,?, (SELECT id FROM slike WHERE src = ?), (SELECT id FROM kategorije WHERE naziv = 'zivotinje'), ?, ?, ?, ?, ?, ?, ?); " +
		slikeSql,
		[
			id,
			naziv,
			cena,
			Boolean(preporuceno),
			thumbnail,
			vrsta,
			morf,
			pol,
			vreme,
			roditelji,
			tezina,
			ostecenja,
			...slikeParams
		]
	);
	await mysql.end();
	return data;
}

async function azurirajZivotinju({id, naziv, cena, preporuceno, slike, thumbnail, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja}) {
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const data = await mysql.query(
		"UPDATE proizvodi SET " + 
		"naziv = ?, cena = ?, preporuceno = ?, thumbnail = (SELECT id FROM slike WHERE src = ?), vrsta = ?, morf = ?, pol = ?, vreme = ?, roditelji = ?, tezina = ?, ostecenja = ? WHERE id = ?; " + 
		"DELETE FROM proizvodi_slike WHERE proizvod_id = ?; " +
		slikeSql,
		[
			naziv,
			cena,
			Boolean(preporuceno),
			thumbnail,
			vrsta,
			morf,
			pol,
			vreme,
			roditelji,
			tezina,
			ostecenja,
			id,
			id,
			...slikeParams
		]
	);
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
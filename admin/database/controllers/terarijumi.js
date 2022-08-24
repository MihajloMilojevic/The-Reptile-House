const mysql = require("..");
const {uid} = require("uid")
const {spojiSlike} = require("./slike")


async function sviTerarijumi() {
	let data = await mysql.query(`SELECT * FROM terarijumi`)
	await mysql.end();
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jedanTerarijum(id) {
	let data = await mysql.query(`SELECT * FROM terarijumi WHERE id = '${id}'`)
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiTerarijum(id) {
	const sql = `DELETE FROM proizvodi WHERE id = '${id}'`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function getDodaciBoje() {
	const sql = `SELECT JSON_OBJECT( 'dodaci', JSON_EXTRACT((SELECT CONCAT('[', GROUP_CONCAT(CONCAT('"', d.naziv, '"') SEPARATOR ','),']') FROM dodaci d), '$'), 'boje', JSON_EXTRACT(( SELECT CONCAT( '[', GROUP_CONCAT( JSON_OBJECT('hex', b.hex) SEPARATOR ', ' ), ']' ) FROM boje b), '$' ) ) as json`;
	const data = await mysql.query(sql);
	await mysql.end();
	return JSON.parse(data[0].json);
}

async function dodajBoju(hex) {
	const sql = `INSERT INTO boje(hex) VALUES ('${hex}')`;
	const data = await mysql.query(sql);
	await mysql.end();
	return mysql.insertId;
}

async function dodajDodatak(naziv) {
	const sql = `INSERT INTO dodaci(naziv) VALUES ('${naziv}')`;
	const data = await mysql.query(sql);
	await mysql.end();
	return mysql.insertId;
}

function spojiBoje(id_proizvoda, boje) {
	return boje.map(({hex}) => `INSERT INTO proizvodi_boje(proizvod_id, boja_id) VALUES ('${id_proizvoda}', (SELECT id FROM boje WHERE hex = '${hex}'));`).join(" ");
}

function spojiDodatke(id_proizvoda, dodaci) {
	return dodaci.map((dodatak) => `INSERT INTO proizvodi_dodaci(proizvod_id, dodatak_id) VALUES ('${id_proizvoda}', (SELECT id FROM dodaci WHERE naziv = '${dodatak}'));`).join(" ");
}

async function kreirajTerarijum({naziv, cena, preporuceno, opis, slike, thumbnail, duzina, sirina, visina, boje, dodaci}) {
	const id = uid(20);
	const sql = `INSERT INTO proizvodi(id, naziv, cena, preporuceno, opis, thumbnail, kategorija_id, duzina, sirina, visina) VALUES ('${id}','${naziv}','${cena}',${preporuceno ? "TRUE" : "FALSE"},'${opis}',(SELECT id FROM slike WHERE src = '${thumbnail}'), (SELECT id FROM kategorije WHERE naziv = 'terarijumi'), '${duzina}', '${sirina}', '${visina}'); ${spojiSlike(id, slike)} ${spojiBoje(id, boje)} ${spojiDodatke(id, dodaci)}`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

async function azurirajTerarijum({id, naziv, cena, preporuceno, opis, slike, thumbnail, duzina, sirina, visina, boje, dodaci}) {
	const sql = `UPDATE proizvodi SET naziv = '${naziv}', cena = '${cena}', preporuceno = ${preporuceno ? "TRUE" : "FALSE"}, opis = '${opis}', thumbnail = (SELECT id FROM slike WHERE src = '${thumbnail}'), duzina = '${duzina}', sirina = '${sirina}', visina = '${visina}' WHERE id = '${id}'; DELETE FROM proizvodi_slike WHERE proizvod_id = '${id}'; DELETE FROM proizvodi_boje WHERE proizvod_id = '${id}'; DELETE FROM proizvodi_dodaci WHERE proizvod_id = '${id}'; ${spojiSlike(id, slike)} ${spojiBoje(id, boje)} ${spojiDodatke(id, dodaci)}`;
	const data = await mysql.query(sql);
	await mysql.end();
	return data;
}

module.exports = {
	sviTerarijumi,
	jedanTerarijum,
	obrisiTerarijum,
	getDodaciBoje,
	dodajBoju,
	dodajDodatak,
	kreirajTerarijum,
	azurirajTerarijum,
}
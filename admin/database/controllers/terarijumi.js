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
	let data = await mysql.query(`SELECT * FROM terarijumi WHERE id = ?`, [id])
	await mysql.end();
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

async function obrisiTerarijum(id) {
	const data = await mysql.query("DELETE FROM proizvodi WHERE id = ?", [id]);
	await mysql.end();
	return data;
}

async function getDodaciBoje() {
	const sql = `SELECT JSON_OBJECT( 'dodaci', JSON_EXTRACT((SELECT CONCAT('[', GROUP_CONCAT(json_dodatak(d.id) SEPARATOR ','),']') FROM dodaci d), '$'), 'boje', JSON_EXTRACT(( SELECT CONCAT( '[', GROUP_CONCAT( JSON_OBJECT('hex', b.hex) SEPARATOR ', ' ), ']' ) FROM boje b), '$' ) ) as json`;
	const data = await mysql.query(sql);
	await mysql.end();
	return JSON.parse(data[0].json);
}

async function getProizvode() {
	const sql = "SELECT id, naziv FROM proizvodi ORDER BY kategorija_id DESC";
	const data = await mysql.query(sql);
	console.log(data);
	await mysql.end();
	return data;
}

async function dodajBoju(hex) {
	const data = await mysql.query("INSERT INTO boje(hex) VALUES (?)", [hex]);
	await mysql.end();
	return data.insertId;
}

function spojiBoje(id_proizvoda, boje) {
	const params = [];
	let sql = "";
	boje.forEach(({hex}) => {
		sql += "INSERT INTO proizvodi_boje(proizvod_id, boja_id) VALUES (?, (SELECT id FROM boje WHERE hex = ?)); "
		params.push(id_proizvoda);
		params.push(hex);
	})
	return [sql, params];
}

function spojiDodatke(id_proizvoda, dodaci) {
	const params = [];
	let sql = "";
	dodaci.forEach(dodatak => {
		sql += "INSERT INTO proizvodi_dodaci(proizvod_id, dodatak_id) VALUES (?, (SELECT id FROM dodaci WHERE naziv = ?)); "
		params.push(id_proizvoda);
		params.push(dodatak.naziv);
	})
	return [sql, params];
}

async function kreirajTerarijum({naziv, cena, preporuceno, opis, slike, thumbnail, duzina, sirina, visina, boje, dodaci}) {
	const id = uid(20);
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const [bojeSql, bojeParams] = spojiBoje(id, boje);
	const [dodaciSql, dodaciParams] = spojiDodatke(id, dodaci)

	const data = await mysql.query(
		"INSERT INTO proizvodi(id, naziv, cena, preporuceno, opis, thumbnail, kategorija_id, duzina, sirina, visina) VALUES " + 
		"( ?, ?, ?, ?, ?,(SELECT id FROM slike WHERE src =  ?), (SELECT id FROM kategorije WHERE naziv = 'terarijumi'), ?,  ?, ?); " +
		slikeSql +
		bojeSql + 
		dodaciSql,
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
			...slikeParams,
			...bojeParams,
			...dodaciParams
		]
	);
	await mysql.end();
	return data;
}

async function azurirajTerarijum({id, naziv, cena, preporuceno, opis, slike, thumbnail, duzina, sirina, visina, boje, dodaci}) {
	const [slikeSql, slikeParams] = spojiSlike(id, slike);
	const [bojeSql, bojeParams] = spojiBoje(id, boje);
	const [dodaciSql, dodaciParams] = spojiDodatke(id, dodaci);
	
	const data = await mysql.query(
		"UPDATE proizvodi SET " + 
		"naziv = ?, cena = ?, preporuceno = ?, opis = ?, thumbnail = (SELECT id FROM slike WHERE src = ?), duzina = ?, sirina = ?, visina = ? WHERE id = ?; " + 
		"DELETE FROM proizvodi_slike WHERE proizvod_id = ?; " + 
		"DELETE FROM proizvodi_boje WHERE proizvod_id = ?; " +
		"DELETE FROM proizvodi_dodaci WHERE proizvod_id = ?; " +
		slikeSql + 
		bojeSql +
		dodaciSql,
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
			id,
			id,
			...slikeParams,
			...bojeParams,
			...dodaciParams
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	sviTerarijumi,
	jedanTerarijum,
	obrisiTerarijum,
	getDodaciBoje,
	getProizvode,
	dodajBoju,
	kreirajTerarijum,
	azurirajTerarijum,
}
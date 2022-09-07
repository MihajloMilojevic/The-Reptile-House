const mysql = require(".");
const {uid} = require("uid");

function dodajProizvodSQL({proizvod_id, porudzbina_id, kolicina, boja, natpis}) {
	return [
		`CALL dodaj_proizvod_porudzbina(?, ?, ?, ?, ?); `,
		[proizvod_id, porudzbina_id, kolicina, boja ?? "", natpis ?? ""]
	]
}

function dodajSveProizvode(proizvodi, id_porudzbine) {
	let sqlAll = "";
	let paramsAll = [];
	proizvodi.forEach(proizvod => {
		const [sql, params] = dodajProizvodSQL({...proizvod, porudzbina_id: id_porudzbine});
		sqlAll += sql;
		paramsAll = [...paramsAll, ...params];
	});
	return [sqlAll, paramsAll];
}

async function poruci({ime, prezime, mejl, adresa, telefon, proizvodi}) {
	const id = uid(20);
	const [dodajSql, dodajParams] = dodajSveProizvode(proizvodi, id);
	let data = await mysql.query(
		"INSERT INTO porudzbine(id, ime, prezime, mejl, adresa, telefon) \n" + 
		"VALUES(?, ?, ?, ?, ?, ?); \n" +
		dodajSql,
		[
			id,
			ime,
			prezime,
			mejl,
			adresa,
			telefon,
			...dodajParams
		]
	);
	await mysql.end();
	return id;
}

async function jednaPorudzbina(id) {
	let data = await mysql.query(`SELECT *, ( SELECT naziv FROM statusi s WHERE s.id = p.status_id ) AS status, ( SELECT SUM(pp.kolicina * pp.cena) FROM proizvodi_porudzbine pp WHERE pp.porudzbina_id = p.id ) as cena FROM porudzbine p WHERE p.id = ?`, [id])
	await mysql.end();
	let proizvodi = await mysql.query(`SELECT json FROM porudzbine_proizvodi WHERE porudzbina_id = ?`, [id]);
	await mysql.end();
	return {...data[0], proizvodi: proizvodi.map(el => JSON.parse(el.json))};
}

module.exports = {
	poruci,
	jednaPorudzbina
};


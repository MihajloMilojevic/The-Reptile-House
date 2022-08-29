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
	console.log({
		sqlAll,
		paramsAll
	})
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
	return data;
}

module.exports = poruci;


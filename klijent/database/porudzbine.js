const mysql = require(".");
const {uid} = require("uid");

function dodajProizvodSQL({proizvod_id, porudzbina_id, kolicina, boja, natpis}) {
	return `CALL dodaj_proizvod_porudzbina('${proizvod_id}', '${porudzbina_id}', ${kolicina}, '${boja ?? ""}', '${natpis ?? ""}'); `;
}

async function poruci({ime, prezime, mejl, adresa, telefon, proizvodi}) {
	const id = uid(20);
	const sql = "INSERT INTO porudzbine(id, ime, prezime, mejl, adresa, telefon) " + 
				`VALUES('${id}', '${ime}', '${prezime}', '${mejl}', '${adresa}', '${telefon}'); ` +
				proizvodi.map(item => dodajProizvodSQL({...item, porudzbina_id: id})).join(" "); 
	let data = await mysql.query(sql);
	return data;
}

module.exports = poruci;


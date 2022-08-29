const mysql = require("..");

async function sveDoplate() {
	const sql = "SELECT * FROM doplate"
	let data = await mysql.query(sql)
	await mysql.end();
	let obj = {};
	data.forEach(element => {
		obj[element.naziv]= element.cena;
	});
	return obj;
}

async function promeniCenu(cena, naziv) {
	const data = await mysql.query(
		"UPDATE doplate SET cena = ? WHERE naziv = ?",
		[
			cena,
			naziv
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	sveDoplate,
	promeniCenu
};


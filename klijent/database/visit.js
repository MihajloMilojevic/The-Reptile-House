const mysql = require(".");

async function dodajPosetu(url) {
	const date = new Date();
	await mysql.query(
		`CALL dodaj_posetu(?, ?, ?, ?)`, 
		[
			url,
			date.getDate(),
			date.getMonth() + 1,
			date.getFullYear()
		]
	);
	await mysql.end();
}

module.exports = {
	dodajPosetu
}
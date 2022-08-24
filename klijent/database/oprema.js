const mysql = require(".");

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

module.exports = {
	svaOprema,
	jednaOprema
}
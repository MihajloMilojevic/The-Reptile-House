const mysql = require(".");

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

module.exports = {
	sveZivotinje,
	jednaZivotinja
}
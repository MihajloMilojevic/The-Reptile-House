const mysql = require(".");

async function svaHrana() {
	let data = await mysql.query(`SELECT * FROM hrana`)
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jednaHrana(id) {
	let data = await mysql.query(`SELECT * FROM hrana WHERE id = '${id}'`)
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

module.exports = {
	svaHrana,
	jednaHrana
}
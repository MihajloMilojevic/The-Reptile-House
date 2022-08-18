const mysql = require(".");

async function sviTerarijumi() {
	let data = await mysql.query(`SELECT * FROM terarijumi`)
	data = data.map(item => JSON.parse(item.json))
	return data
}

async function jedanTerarijum(id) {
	let data = await mysql.query(`SELECT * FROM terarijumi WHERE id = '${id}'`)
	if(data.length === 0) return null;
	return JSON.parse(data[0].json);
}

module.exports = {
	sviTerarijumi,
	jedanTerarijum
}
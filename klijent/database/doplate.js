const mysql = require(".");

async function doplate() {
	const sql = "SELECT * FROM doplate"
	let data = await mysql.query(sql)
	let obj = {};
	data.forEach(element => {
		obj[element.naziv]= element.cena;
	});
	return obj;
}

module.exports = doplate;


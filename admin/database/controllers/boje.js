const mysql = require("..");

async function sveBoje() {
	const sql = "SELECT * FROM boje"
	let data = await mysql.query(sql)
	await mysql.end();
	return data;
}

async function obrisiBoju(hex) {
	const data = await mysql.query(
		"DELETE FROM boje WHERE hex = ?",
		[
			hex
		]
	);
	await mysql.end();
	return data;
}

module.exports = {
	sveBoje,
	obrisiBoju,
};


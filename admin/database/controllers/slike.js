const mysql = require("..");

async function sveSlike() {
	let data = await mysql.query("SELECT * FROM slike ORDER BY kategorija_id");
	await mysql.end();
	return data;
}

async function slikePoKategoriji(kategorija) {
	let data = await mysql.query(
		"SELECT s.id, s.src FROM slike s JOIN kategorije k ON s.kategorija_id = k.id WHERE k.naziv = ?",
		[
			kategorija
		]
	);
	await mysql.end();
	return data;
}

function spojiSlike(id_proizvoda, slike_id) {
	const params = [];
	let sql = "";
	slike_id.forEach(id_slike => {
		sql += "INSERT INTO proizvodi_slike(proizvod_id, slika_id) VALUES (?, ?); ";
		params.push(id_proizvoda);
		params.push(id_slike);
	})
	return [sql, params];
}

module.exports = {
	sveSlike,
	slikePoKategoriji,
	spojiSlike,
}
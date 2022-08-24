const mysql = require("..");

async function slikePoKategoriji(kategorija) {
	const sql = `SELECT s.id, s.src FROM slike s JOIN kategorije k ON s.kategorija_id = k.id WHERE k.naziv = '${kategorija}'`
	let data = await mysql.query(sql);
	await mysql.end();
	return data;
}

function spojiSlike(id_proizvoda, slike_id) {
	return slike_id.map(id => `INSERT INTO proizvodi_slike(proizvod_id, slika_id) VALUES ('${id_proizvoda}', '${id}');`).join(" ");
}

module.exports = {
	slikePoKategoriji,
	spojiSlike
}
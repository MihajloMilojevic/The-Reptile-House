CREATE TABLE korisnici (
	mejl VARCHAR(100) PRIMARY KEY,
	ime TEXT NOT NULL,
	prezime TEXT NOT NULL,
	lozinka TEXT NOT NULL
);

CREATE TABLE doplate (
	id INT PRIMARY KEY AUTO_INCREMENT,
	naziv TEXT NOT NULL,
	cena FLOAT NOT NULL
);

CREATE TABLE kategorije (
	id INT PRIMARY KEY AUTO_INCREMENT,
	naziv TEXT NOT NULL
);

CREATE TABLE statusi (
	id INT PRIMARY KEY AUTO_INCREMENT,
	naziv TEXT NOT NULL
);

CREATE TABLE boje (
	id INT PRIMARY KEY AUTO_INCREMENT,
	hex VARCHAR(20) NOT NULL
);

CREATE TABLE slike (
	id INT PRIMARY KEY AUTO_INCREMENT,
	src TEXT NOT NULL,
	kategorija_id INT NOT NULL REFERENCES kategorije(id)
);

CREATE TABLE porudzbine (
	id VARCHAR(20) PRIMARY KEY,
	ime TEXT NOT NULL,
	prezime TEXT NOT NULL,
	mejl TEXT NOT NULL,
	telefon TEXT NOT NULL,
	adresa TEXT NOT NULL,
	datum DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	status_id INT NOT NULL DEFAULT 1 REFERENCES statusi(id) ,
	posiljka_id TEXT
);

CREATE TABLE proizvodi (
	id VARCHAR(20) PRIMARY KEY,
	naziv TEXT NOT NULL,
	cena FLOAT NOT NULL,
	preporuceno BOOLEAN DEFAULT FALSE NOT NULL,
	thumbnail int NOT NULL REFERENCES slike(id),
	kategorija_id int NOT NULL REFERENCES kategorije(id),
	opis TEXT,
	duzina INT,
	sirina INT,
	visina INT,
	vrsta TEXT,
	morf TEXT,
	pol TEXT,
	vreme TEXT,
	roditelji TEXT,
	tezina TEXT,
	ostecenja TEXT
);

CREATE TABLE dodaci (
	id INT PRIMARY KEY AUTO_INCREMENT,
	naziv TEXT NOT NULL,
	proizvod_id VARCHAR(20) REFERENCES proizvodi(id)
);

CREATE TABLE proizvodi_slike (
	proizvod_id VARCHAR(20) NOT NULL REFERENCES proizvodi(id),
	slika_id INT NOT NULL REFERENCES slike(id),
	PRIMARY KEY(proizvod_id, slika_id)
);

CREATE TABLE proizvodi_boje (
	proizvod_id VARCHAR(20) NOT NULL REFERENCES proizvodi(id),
	boja_id INT NOT NULL REFERENCES boje(id),
	PRIMARY KEY(proizvod_id, boja_id)
);

CREATE TABLE proizvodi_dodaci (
	proizvod_id VARCHAR(20) NOT NULL REFERENCES proizvodi(id),
	dodatak_id INT NOT NULL REFERENCES dodaci(id),
	PRIMARY KEY(proizvod_id, dodatak_id)
);

CREATE TABLE proizvodi_porudzbine (
	proizvod_id VARCHAR(20) NOT NULL REFERENCES proizvodi(id),
	porudzbina_id VARCHAR(20) NOT NULL REFERENCES porudzbine(id),
	cena FLOAT,
	kolicina INT NOT NULL,
	boja VARCHAR(20),
	natpis VARCHAR(100),
	PRIMARY KEY(proizvod_id, porudzbina_id, boja, natpis)
);

DELIMITER //

CREATE PROCEDURE dodaj_proizvod_porudzbina(proizvod_id_in VARCHAR(20), porudzbina_id_in VARCHAR(20), kolicina_in INT, boja_in TEXT, natpis_in TEXT)
BEGIN
	DECLARE cena_proizvoda INT;
	DECLARE boja_postoji BOOLEAN DEFAULT FALSE;

	IF (boja_in <> '') THEN 
		SET boja_postoji = ((SELECT COUNT(*) FROM proizvodi p JOIN proizvodi_boje pb ON p.id = pb.proizvod_id JOIN boje b ON b.id = pb.boja_id WHERE pb.proizvod_id = proizvod_id_in AND b.hex = boja_in) = 1);
	END IF;

	SET cena_proizvoda = (SELECT cena FROM proizvodi WHERE id = proizvod_id_in);
	IF (boja_in <> '' AND NOT boja_postoji) THEN 
		SET cena_proizvoda = cena_proizvoda + (SELECT cena FROM doplate WHERE naziv = 'boja');
	END IF;
	IF (natpis_in <> '') THEN 
		SET cena_proizvoda = cena_proizvoda + (SELECT cena FROM doplate WHERE naziv = 'natpis');
	END IF;
	INSERT INTO proizvodi_porudzbine(proizvod_id, porudzbina_id, cena, kolicina, boja, natpis)
	VALUES(proizvod_id_in, porudzbina_id_in, cena_proizvoda, kolicina_in, boja_in, natpis_in);
END//

CREATE FUNCTION json_slike(proizvod_id_in VARCHAR(20), alt TEXT) RETURNS JSON
BEGIN
	RETURN JSON_EXTRACT(( SELECT CONCAT( '[', GROUP_CONCAT( JSON_OBJECT('id', s.id, 'src', s.src, 'alt', alt) SEPARATOR ', ' ), ']' ) FROM slike s JOIN proizvodi_slike ps ON ps.slika_id = s.id WHERE ps.proizvod_id = proizvod_id_in ), '$' );
END//

CREATE FUNCTION json_boje(proizvod_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN JSON_EXTRACT(( SELECT CONCAT( '[', GROUP_CONCAT( JSON_OBJECT('hex', b.hex) SEPARATOR ', ' ), ']' ) FROM boje b JOIN proizvodi_boje pb ON pb.boja_id = b.id WHERE pb.proizvod_id = proizvod_id_in ), '$' );
END//

CREATE FUNCTION json_dodatak(dodatak_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN (SELECT JSON_OBJECT('naziv', d.naziv, 'proizvod_url', (SELECT CONCAT('/', k.naziv, '/', p.id) FROM proizvodi p JOIN kategorije k ON p.kategorija_id = k.id WHERE p.id = d.proizvod_id)) FROM dodaci d WHERE d.id = dodatak_id_in);
END//

CREATE FUNCTION json_dodaci(proizvod_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN JSON_EXTRACT((SELECT CONCAT('[', GROUP_CONCAT(json_dodatak(d.id)), ']') FROM dodaci d JOIN proizvodi_dodaci pd ON d.id = pd.dodatak_id WHERE pd.proizvod_id = proizvod_id_in), '$');
END//

CREATE FUNCTION json_hrana(proizvod_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN (SELECT JSON_OBJECT('kategorija', (SELECT naziv FROM kategorije WHERE id = p.kategorija_id), 'id', p.id, 'naziv', p.naziv, 'cena', p.cena, 'opis', p.opis, 'preporuceno', p.preporuceno, 'thumbnail', ( SELECT src FROM slike WHERE id = p.thumbnail ), 'slike', (JSON_EXTRACT(json_slike(p.id, p.naziv), '$')) ) AS JSON FROM proizvodi p WHERE p.id = proizvod_id_in);
END//

CREATE FUNCTION json_oprema(proizvod_id_in VARCHAR(20)) RETURNS JSON
BEGIN

	DECLARE result JSON;
    
	SET result = (SELECT JSON_OBJECT('kategorija', (SELECT naziv FROM kategorije WHERE id = p.kategorija_id), 'id', p.id, 'naziv', p.naziv, 'cena', p.cena, 'opis', p.opis, 'preporuceno', p.preporuceno, 'thumbnail', ( SELECT src FROM slike WHERE id = p.thumbnail ), 'dimenzije', JSON_OBJECT('duzina', p.duzina, 'sirina', p.sirina, 'visina', p.visina), 'slike', (JSON_EXTRACT(json_slike(p.id, p.naziv), '$')) ) AS JSON FROM proizvodi p WHERE p.id = proizvod_id_in);
    
    IF ((SELECT p.duzina IS NULL FROM proizvodi p WHERE p.id = proizvod_id_in)) THEN
    	SET result = JSON_REMOVE(result, '$.dimenzije.duzina');
    END IF;
    
    IF ((SELECT p.sirina IS NULL FROM proizvodi p WHERE p.id = proizvod_id_in)) THEN
    	SET result = JSON_REMOVE(result, '$.dimenzije.sirina');
    END IF;
    
    IF ((SELECT p.visina IS NULL FROM proizvodi p WHERE p.id = proizvod_id_in)) THEN
    	SET result = JSON_REMOVE(result, '$.dimenzije.visina');
    END IF;
    
    IF ((SELECT (p.duzina IS NULL AND p.sirina IS NULL AND p.visina IS NULL) FROM proizvodi p WHERE p.id = proizvod_id_in)) THEN
    	SET result = JSON_REMOVE(result, '$.dimenzije');
    END IF;
    
    RETURN result;
END//

CREATE FUNCTION json_zivotinja(proizvod_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN (SELECT JSON_OBJECT('kategorija', (SELECT naziv FROM kategorije WHERE id = p.kategorija_id), 'id', p.id, 'naziv', p.naziv, 'cena', p.cena, 'preporuceno', p.preporuceno, 'thumbnail', ( SELECT src FROM slike WHERE id = p.thumbnail ), 'slike', (JSON_EXTRACT(json_slike(p.id, p.naziv), '$')), 'vrsta', p.vrsta, 'morf', p.morf, 'pol', p.pol, 'vreme', p.vreme, 'roditelji', p.roditelji, 'tezina', p.tezina, 'ostecenja', p.ostecenja ) AS JSON FROM proizvodi p WHERE p.id = proizvod_id_in);
END//

CREATE FUNCTION json_terarijum(proizvod_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN (SELECT JSON_OBJECT('kategorija', (SELECT naziv FROM kategorije WHERE id = p.kategorija_id), 'id', p.id, 'naziv', p.naziv, 'cena', p.cena, 'opis', p.opis, 'preporuceno', p.preporuceno, 'thumbnail', ( SELECT src FROM slike WHERE id = p.thumbnail ), 'slike', (JSON_EXTRACT(json_slike(p.id, p.naziv), '$')), 'dodaci', (JSON_EXTRACT(json_dodaci(p.id), '$')), 'boje', (JSON_EXTRACT(json_boje(p.id), '$')), 'dimenzije', JSON_OBJECT('duzina', p.duzina, 'sirina', p.sirina, 'visina', p.visina)) AS JSON FROM proizvodi p WHERE p.id = proizvod_id_in);
END//

CREATE FUNCTION json_porudzbina(porudzbina_id_in VARCHAR(20)) RETURNS JSON
BEGIN
	RETURN (SELECT JSON_OBJECT('id', p.id, 'ime', p.ime, 'prezime', p.prezime, 'mejl', p.mejl, 'telefon', p.telefon, 'adresa', p.adresa, 'datum', p.datum, 'posiljka_id', p.posiljka_id, 'status', (SELECT naziv FROM statusi s WHERE s.id = p.status_id), 'cena', (SELECT SUM(pp.kolicina * pp.cena) FROM proizvodi_porudzbine pp WHERE pp.porudzbina_id = p.id), 'proizvodi', JSON_EXTRACT((SELECT CONCAT('[', GROUP_CONCAT( CASE k.naziv WHEN 'terarijumi' THEN JSON_SET((json_terarijum(pr.id)), '$.cena', pp.cena, '$.kolicina', pp.kolicina, '$.boja', pp.boja, '$.natpis', pp.natpis) WHEN 'zivotinje' THEN JSON_SET((json_zivotinja(pr.id)), '$.cena', pp.cena, '$.kolicina', pp.kolicina) WHEN 'hrana' THEN JSON_SET((json_hrana(pr.id)), '$.cena', pp.cena, '$.kolicina', pp.kolicina) ELSE JSON_SET((json_oprema(pr.id)), '$.cena', pp.cena, '$.kolicina', pp.kolicina) END SEPARATOR ', '), ']') FROM proizvodi pr JOIN kategorije k ON pr.kategorija_id = k.id JOIN proizvodi_porudzbine pp ON pr.id = pp.proizvod_id WHERE pp.porudzbina_id = p.id), '$')) AS JSON  FROM porudzbine p WHERE id = porudzbina_id_in);
END//

CREATE TRIGGER proizvod_delete BEFORE DELETE ON proizvodi FOR EACH ROW
BEGIN
	DELETE FROM proizvodi_boje WHERE proizvod_id = OLD.id;
	DELETE FROM proizvodi_slike WHERE proizvod_id = OLD.id;
	DELETE FROM proizvodi_dodaci WHERE proizvod_id = OLD.id;
	DELETE FROM proizvodi_porudzbine WHERE proizvod_id = OLD.id;
END//

CREATE TRIGGER slike_before_delete BEFORE DELETE ON slike FOR EACH ROW
BEGIN
	if((SELECT 1 = ANY(SELECT COUNT(*) FROM proizvodi_slike ps WHERE ps.proizvod_id IN(SELECT DISTINCT ps.proizvod_id FROM proizvodi_slike ps WHERE ps.slika_id = OLD.id) GROUP BY ps.proizvod_id)) = 1 ) THEN
    	SIGNAL SQLSTATE 'HY000' SET MESSAGE_TEXT = 'Ne možete obrisati ovu sliku jer bi proizvod ostao bez ijedne slike';
	END IF;
    IF((SELECT COUNT(*) FROM proizvodi p WHERE p.thumbnail = OLD.id) <> 0) THEN 
    	SIGNAL SQLSTATE 'HY000' SET MESSAGE_TEXT = 'Ne možete obrisati ovu sliku jer je ona postavljena kao thumbnail proizvoda';
    END IF;
    DELETE FROM proizvodi_slike WHERE slika_id = OLD.id;
END //

CREATE TRIGGER boje_before_delete BEFORE DELETE ON boje FOR EACH ROW
BEGIN
    DELETE FROM proizvodi_boje WHERE boja_id = OLD.id;
END //

CREATE TRIGGER dodaci_before_delete BEFORE DELETE ON dodaci FOR EACH ROW
BEGIN
    DELETE FROM proizvodi_dodaci WHERE dodatak_id = OLD.id;
END //

DELIMITER ;

CREATE VIEW hrana as (SELECT json_hrana(p.id) as json, p.id, p.naziv, p.kategorija_id, p.preporuceno FROM proizvodi p JOIN kategorije k ON p.kategorija_id = k.id WHERE k.naziv = 'hrana' ORDER BY p.naziv);
CREATE VIEW oprema as (SELECT json_oprema(p.id) as json, p.id, p.naziv, p.kategorija_id, p.preporuceno FROM proizvodi p JOIN kategorije k ON p.kategorija_id = k.id WHERE k.naziv = 'oprema' ORDER BY p.naziv);
CREATE VIEW zivotinje as (SELECT json_zivotinja(p.id) as json, p.id, p.naziv, p.kategorija_id, p.preporuceno FROM proizvodi p JOIN kategorije k ON p.kategorija_id = k.id WHERE k.naziv = 'zivotinje' ORDER BY p.naziv);
CREATE VIEW terarijumi as (SELECT json_terarijum(p.id) as json, p.id, p.naziv, p.kategorija_id, p.preporuceno FROM proizvodi p JOIN kategorije k ON p.kategorija_id = k.id WHERE k.naziv = 'terarijumi' ORDER BY p.naziv);
CREATE VIEW porudzbine_json as (SELECT json_porudzbina(p.id) as json, p.id, p.ime, p.adresa, p.mejl, p.telefon, p.datum, p.status_id, p.posiljka_id FROM porudzbine p ORDER BY p.datum DESC);

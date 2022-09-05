DROP VIEW hrana;
DROP VIEW oprema;
DROP VIEW zivotinje;
DROP VIEW terarijumi;
DROP VIEW porudzbine_json;

DROP PROCEDURE dodaj_proizvod_porudzbina;

DROP TRIGGER proizvod_delete;
DROP TRIGGER slike_before_delete;
DROP TRIGGER boje_before_delete;
DROP TRIGGER dodaci_before_delete;

DROP FUNCTION json_dodatak;
DROP FUNCTION json_porudzbina;
DROP FUNCTION json_terarijum;
DROP FUNCTION json_zivotinja;
DROP FUNCTION json_hrana;
DROP FUNCTION json_oprema;
DROP FUNCTION json_boje;
DROP FUNCTION json_dodaci;
DROP FUNCTION json_slike;

DROP TABLE proizvodi_porudzbine;
DROP TABLE proizvodi_dodaci;
DROP TABLE proizvodi_boje;
DROP TABLE proizvodi_slike;
DROP TABLE dodaci;
DROP TABLE proizvodi;
DROP TABLE porudzbine;
DROP TABLE slike;
DROP TABLE boje;
DROP TABLE kategorije;
DROP TABLE statusi;
DROP TABLE doplate;
DROP TABLE korisnici;
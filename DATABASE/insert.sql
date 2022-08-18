INSERT INTO kategorije(naziv) VALUES 
('terarijumi'), 	-- id: 1 --
('zivotinje'), 		-- id: 2 --
('hrana'), 			-- id: 3 --
('oprema'); 		-- id: 4 --

INSERT INTO doplate (naziv, cena) VALUES 
('boja', 1500),  	-- id: 1 --
('natpis', 2000);	-- id: 2 --

INSERT INTO boje(hex) VALUES
('#000000'), -- id: 1 --
('#9c9a9a'), -- id: 2 --
('#ffffff'); -- id: 3 --

INSERT INTO dodaci(naziv) VALUES 
('Uvb fluorescentna lampa 10%'),  		-- id: 1 --
('Spot sijalica 25W'),					-- id: 2 --
('Wi-Fi (tuch) prekidac'), 				-- id: 3 --
('HD kamera za pracenje zivotinja'), 	-- id: 4 --
('Uvb senzor'); 						-- id: 5 --

INSERT INTO slike(src, kategorija_id) VALUES
('/terarijumi/TH1-1.jpeg', 1), 				-- id: 1 --
('/terarijumi/TH1-2.jpeg', 1), 				-- id: 2 --
('/terarijumi/TH1-3.jpeg', 1), 				-- id: 3 --
('/terarijumi/TH1-4.jpeg', 1),				-- id: 4 --
('/zivotinje/loptasti_piton_1.jpg', 2), 	-- id: 5 --
('/zivotinje/leopard_gekon_1.jpg', 2), 		-- id: 6 --
('/hrana/fobasi1.jpg', 3), 					-- id: 7 --
('/hrana/fobasi2.jpg', 3), 					-- id: 8 --
('/hrana/fobasi3.jpg', 3), 					-- id: 9 --
('/hrana/dubije1.jpg', 3), 					-- id: 10 --
('/hrana/dubije2.jpg', 3), 					-- id: 11 --
('/hrana/dubije3.jpg', 3), 					-- id: 12 --
('/oprema/uvbLampe1.jpg', 4),				-- id: 13 --
('/oprema/uvbLampe2.jpg', 4), 				-- id: 14 --
('/oprema/spotSIjaliceCrne1.jpg', 4), 		-- id: 15 --
('/oprema/spotSIjaliceCrne2.jpg', 4), 		-- id: 16 --
('/oprema/spotSIjaliceCrne3.jpg', 4), 		-- id: 17 --
('/oprema/spotSIjaliceKlasik1.jpg', 4), 	-- id: 18 --
('/oprema/spotSIjaliceKlasik2.jpg', 4), 	-- id: 19 --
('/oprema/uvbSenzori1.jpg', 4), 			-- id: 20 --
('/oprema/uvbSenzori2.jpg', 4), 			-- id: 21 --
('/oprema/uvbSenzori3.jpg', 4); 			-- id: 22 --

-- TERARIJUMI --
INSERT INTO proizvodi(id, naziv, cena, preporuceno, thumbnail, kategorija_id, opis, duzina, sirina, visina) VALUES
('yful6xljeav', 'THR - T1 800x400x400', 5000, TRUE, 1, 1, 'Terarijumi THR- T1, predvidjeni su za cuvanje vecih gustera (bradate agame) i zmija srednje velicine (loptasti pitoni, smukovi...).', 800, 400, 400),
('6e9nl6xljm6f', 'THR - T2 500x350x350', 5000, TRUE, 1, 1,  'Terarijumi THR- T2, predvidjeni su za cuvanje vecih gustera (bradate agame) i zmija srednje velicine (loptasti pitoni, smukovi...).', 500, 350, 350);

-- ZIVOTINJE --
INSERT INTO proizvodi(id, naziv, cena, preporuceno, thumbnail, kategorija_id, vrsta, morf, pol, vreme, roditelji, tezina, ostecenja) VALUES
('5zotl6xlsqk6', 'Leopard gekon', 3500, TRUE, 6, 2, 'Leopard gekon', 'Radar mack snow', 'Mužijak', 'Februar 2022.', 'Mack snow w&y het radar x radar tangerine', '20g', '/'),
('1lecl6xlsrpc', 'Loptasti piton', 4000, TRUE, 5, 2, 'Loptasti piton', 'Radar mack snow', 'Mužijak', 'Februar 2022.', 'Mack snow w&y het radar x radar tangerine', '20g', '/');

-- HRANA --
INSERT INTO proizvodi(id, naziv, cena, preporuceno, thumbnail, kategorija_id, opis) VALUES
('5mhnl6xm31co', 'Fobasi - 100kom', 500, FALSE, 7, 3, 'Fobasi, odlicna hrana za Vašeg ljubimca!'),
('j4yxl6xm31wq', 'Fobasi - 200kom', 850, FALSE, 7, 3, 'Fobasi, odlicna hrana za Vašeg ljubimca!'),
('iuyhl6xm32cb', 'Fobasi - 300kom', 1200, TRUE, 7, 3, 'Fobasi, odlicna hrana za Vašeg ljubimca!'),
('b5e9l6xm32rq', 'Dubije - 100kom', 600, FALSE, 10, 3, 'Dubije, odlcan izvor proteina za Vašeg ljubimca.'),
('f9p2l6xm5lph', 'Dubije - 200kom', 1200, FALSE, 10, 3, 'Dubije, odlcan izvor proteina za Vašeg ljubimca.'),
('g9gel6xm33lz', 'Dubije - 300kom', 1600, TRUE, 10, 3, 'Dubije, odlcan izvor proteina za Vašeg ljubimca.');

-- OPREMA --
INSERT INTO proizvodi(id, naziv, cena, preporuceno, thumbnail, kategorija_id, opis) VALUES
('2j1el6xm9yen', 'UVB lampe 10%', 2200, TRUE, 13, 4, 'U ponudi E27 fluorescentne, spiralne uvb lampe za reptile. UVB zraci 10%'),
('eb8ll6xm9yz6', 'UVB lampe 5%', 2200, FALSE, 13, 4, 'U ponudi E27 fluorescentne, spiralne uvb lampe za reptile. UVB zraci 5%'),
('2jm5l6xm9zit', 'Spot sijalica crna (25W)', 750, FALSE, 15, 4, 'U ponudi E27 crne kao i klasicne spot sijalice (3% uvb)'),
('k3vnl6xma00y', 'Spot sijalica crna (50W)', 850, TRUE, 15, 4, 'U ponudi E27 crne kao i klasicne spot sijalice (3% uvb)'),
('fjxol6xma0j6', 'Spot sijalica klasik (25W)', 600, FALSE, 18, 4, 'U ponudi E27 crne kao i klasicne spot sijalice (3% uvb)'),
('idxhl6xma14q', 'Spot sijalica klasik (50W)', 700, TRUE, 18, 4, 'U ponudi E27 crne kao i klasicne spot sijalice (3% uvb)'),
('9j1kl6xma1vc', 'UVB senzori', 950, TRUE, 20, 4, 'U ponudi Uvb senzori kojima mozete proveriti efektivnost Vase lampe.');

INSERT INTO proizvodi_slike(proizvod_id, slika_id) VALUES
('yful6xljeav', 1),
('yful6xljeav', 2),
('yful6xljeav', 3),
('yful6xljeav', 4),
('6e9nl6xljm6f', 1),
('6e9nl6xljm6f', 2),
('6e9nl6xljm6f', 3),
('6e9nl6xljm6f', 4),
('5zotl6xlsqk6', 6),
('1lecl6xlsrpc', 5),
('5mhnl6xm31co', 7),
('5mhnl6xm31co', 8),
('5mhnl6xm31co', 9),
('j4yxl6xm31wq', 7),
('j4yxl6xm31wq', 8),
('j4yxl6xm31wq', 9),
('iuyhl6xm32cb', 7),
('iuyhl6xm32cb', 8),
('iuyhl6xm32cb', 9),
('b5e9l6xm32rq', 10),
('b5e9l6xm32rq', 11),
('b5e9l6xm32rq', 12),
('f9p2l6xm5lph', 10),
('f9p2l6xm5lph', 11),
('f9p2l6xm5lph', 12),
('g9gel6xm33lz', 10),
('g9gel6xm33lz', 11),
('g9gel6xm33lz', 12),
('2j1el6xm9yen', 13),
('2j1el6xm9yen', 14),
('eb8ll6xm9yz6', 13),
('eb8ll6xm9yz6', 14),
('2jm5l6xm9zit', 15),
('2jm5l6xm9zit', 16),
('2jm5l6xm9zit', 17),
('k3vnl6xma00y', 15),
('k3vnl6xma00y', 16),
('k3vnl6xma00y', 17),
('fjxol6xma0j6', 18),
('fjxol6xma0j6', 19),
('idxhl6xma14q', 18),
('idxhl6xma14q', 19),
('9j1kl6xma1vc', 20),
('9j1kl6xma1vc', 21),
('9j1kl6xma1vc', 22);

INSERT INTO proizvodi_boje(proizvod_id, boja_id) VALUES
('yful6xljeav', 1),
('yful6xljeav', 2),
('yful6xljeav', 3),
('6e9nl6xljm6f', 1),
('6e9nl6xljm6f', 2),
('6e9nl6xljm6f', 3);

INSERT INTO proizvodi_dodaci(proizvod_id, dodatak_id) VALUES
('yful6xljeav', 1),
('yful6xljeav', 2),
('yful6xljeav', 3),
('yful6xljeav', 4),
('yful6xljeav', 5),
('6e9nl6xljm6f', 1),
('6e9nl6xljm6f', 2),
('6e9nl6xljm6f', 3),
('6e9nl6xljm6f', 4),
('6e9nl6xljm6f', 5);

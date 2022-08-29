import nc from "next-connect";
import { uid } from "uid";
import fileUpload from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import path from "path"
import { kreirajSliku, obrisiSliku } from "../../database/slike";
import cors from "cors";

const handler = nc({
	onError: (err, req, res, next) => {
		console.error(err.stack);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false, message: err.message || "Došlo je do greške. Probajte ponovo kasnije."});
	},
	onNoMatch: (req, res) => {
		res.status(StatusCodes.NOT_FOUND).json({ok: false, message: `${req.method} ${req.url} ne postoji`});
	},
});



handler.use(cors({
	// "origin": ["*"],
	// "origin": ["http://localhost:8000"],
	"methods": "GET, POST, PUT, DELETE",
}));


handler.use(fileUpload())

handler.post(async (req, res) => { 
	const ids = [];
	for (const key in req.files) {
		const image = req.files[key];
		const splitImageName = image.name.split(".");
		const imageExtension = splitImageName[splitImageName.length - 1];
		const imageName = uid(20) + "." + imageExtension;
		const imagePath = path.join(__dirname, "../../../../public/images", imageName);
		await image.mv(imagePath);
		const data = await kreirajSliku(`/images/${imageName}`, req.body.kategorija);
		ids.push(data.insertId);
	}
	res.status(StatusCodes.CREATED).json({ok: true, ids});
})

handler.delete(async (req, res) => {
	console.log("start");
	const data = await obrisiSliku(req.body.src);
	console.log("return")
	res.status(StatusCodes.OK).json({ok: true, data});
})

handler.options(async (req, res) => {
	res.status(StatusCodes.OK).end();
})

export default handler;

export const config = {
	api: {
	  bodyParser: false
	}
  };
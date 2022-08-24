import nc from "next-connect";
import errorWraper from "../../middleware/errorWrapper";
import Errors from "../../errors";
import { uid } from "uid";
import fileUpload from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import path from "path"

const handler = nc({
	onNoMatch: errorWraper((req, res) => {throw new Errors.NotFoundError(`${req.method} ${req.url} ne postoji`)})
});

handler.use(fileUpload())

handler.post(errorWraper(async (req, res) => {
	console.log(req.files)
	for (const key in req.files) {
		const image = req.files[key];
		const splitImageName = image.name.split(".");
		const imageExtension = splitImageName[splitImageName.length - 1];
		const imageName = uid(20) + "." + imageExtension;
		const imagePath = path.join(__dirname, "../../../../public/images", imageName);
		await image.mv(imagePath);
	}
	// res.redirect(req.headers.origin);
	res.status(StatusCodes.CREATED).json({ok: true});
}))

export default handler;

export const config = {
	api: {
	  bodyParser: false
	}
  };
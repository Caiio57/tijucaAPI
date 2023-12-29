import multer, { Options } from "multer"
import path from "path"

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, "..", "..", "upload"),
        filename(req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`)
        },
    }),
    limits: {
        fileSize: 8 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const mimetype = ["image/png", "image/jpeg", "image/jpg"]

        if(!mimetype.includes(file.mimetype)) {
            return cb(null, false)
        }
        cb(null, true)
    }
} as Options; 
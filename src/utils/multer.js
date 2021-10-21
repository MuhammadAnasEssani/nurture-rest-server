const multer = require("multer");
const path = require("path");
const shortid = require("shortid")


module.exports = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(path.dirname(__dirname), 'uploads'))
        },
        filename: function (req, file, cb) {
            cb(null, shortid.generate() + '-' + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});
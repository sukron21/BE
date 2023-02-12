const multer = require('multer');
const path = require('path');

const multerUpload = multer({
    storage: multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const filename = Date.now() + "" + ext;
        cb(null, filename);
    }
    }),
    limits: {
        // limit filesize up to 2mb
        fileSize: 100 * 1024 ,
    },

    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if(ext === '.jpg' || ext === '.png' ){
            cb(null, true);
        }else{
            const error = {
                message: 'File type is not supported'
            }
            cb(error, false);
        }
    }
})

module.exports = {
    uploadPhoto: (req, res, next) => {
        const multerSingle = multerUpload.single('photo');
        multerSingle(req, res, (err) => {
            if(err){
                res.json({
                    message: 'upload product photo failed bor',
                    error: err
                })
                console.log(err);
            }else{
                next();
            }
        })
    }
}
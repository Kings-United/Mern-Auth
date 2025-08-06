import multer from 'multer';


export const store = multer.diskStorage({
    destination: 'upload',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + file.originalname);
    }
})
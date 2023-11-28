
const multer = require('multer');

const uploadPath = '../../public/uploads';

const generalStorage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const filename = file.originalname;
      cb(null, filename);
    },
  }),
});

module.exports = {
  generalStorage,
};
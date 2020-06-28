const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') cb(null, 'public/img');
    if (file.fieldname === 'resume') cb(null, 'public/resume');
  },
  filename: function (req, file, cb) {
    let fileName;
    let ext = file.originalname.split('.')[1];
    if (file.fieldname === 'image') {
      fileName = file.originalname.split(' ')[0];
      req.fileName = fileName;
    }
    if (file.fieldname === 'resume') fileName = file.originalname.split('.')[0];
    cb(null, `${fileName}-${Date.now()}.${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.fieldname === 'image' && file.mimetype.split('/')[0] === 'image')
    cb(null, true);
  else if (
    file.fieldname === 'resume' &&
    file.mimetype.split('/')[0] === 'application'
  )
    cb(null, true);
  else cb(null, false);
}

const uploadFiles = multer({
  storage,
  fileFilter,
});

module.exports = uploadFiles;

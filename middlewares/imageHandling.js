const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+Date.now()+'.pdf');
  },
});

const fileFilter = function (req, file, cb) {
  // Accept only jpeg and png files
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
});

module.exports = upload;

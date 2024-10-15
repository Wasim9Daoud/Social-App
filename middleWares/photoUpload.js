const path = require("path");
const multer = require("multer");

// PHOTO STORAGE
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    if (file) {
      // make file name as date and replace every ":" => "-" (for windows)
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      // don't write name
      cb(null, false);
    }
  },
});

// PHOTO-UPLOAD MIDDLEWARE
const photoUpload = multer({
  storage: photoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 }, // 1MB
});

module.exports = photoUpload;

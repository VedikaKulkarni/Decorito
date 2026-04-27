const multer = require("multer");

// store file in memory for cloud upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;

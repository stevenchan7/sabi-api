import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, '..', '..', 'public', 'temp');

    // Check if the directory exists; if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

// File filter function
const imageFileFilter = (req, file, cb) => {
  // Allow only PDF files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Format file harus .png atau .jpeg!'), false); // Reject the file
  }
};

export const upload = multer({
  storage: tempStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 1000 * 1024, // Limit to 1mb
  },
});

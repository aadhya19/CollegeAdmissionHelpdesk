import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use path relative to the current module
const baseUploadPath = path.join(__dirname, '..', 'uploads');
console.log('Base upload path:', baseUploadPath);

// Ensure the uploads directory exists
if (!fs.existsSync(baseUploadPath)) {
  console.log('Creating uploads directory...');
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Create a function that returns a configured multer instance
const createUploader = (queryId) => {
  // Configure storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(baseUploadPath, queryId);
      console.log('Upload path for query:', uploadPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        console.log('Creating query directory:', uploadPath);
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      console.log('Destination directory exists:', fs.existsSync(uploadPath));
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + path.extname(file.originalname);
      console.log('Generated filename:', filename);
      cb(null, filename);
    }
  });

  // File filter to accept only certain file types
  const fileFilter = (req, file, cb) => {
    console.log('Processing file:', file);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, and DOC files are allowed.'), false);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
};

export default createUploader;

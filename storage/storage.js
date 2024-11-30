const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_PUBLIC_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Function to dynamically get folder names
const getFolderName = (req, file) => {
  if (file.mimetype.startsWith('image')) {
    return 'iReporter/images';
  } else if (file.mimetype.startsWith('video')) {
    return 'iReporter/videos';
  } else {
    throw new Error('Unsupported file type');
  }
};

// Cloudinary Storage for handling images and videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => getFolderName(req, file),
    format: (req, file) => file.mimetype.split('/')[1],
    resource_type: 'auto',
    public_id: (req, file) => {
      const nameWithoutExt = (file.originalname || 'unknown_file')
        .split('.')[0]
        .replace(/\s+/g, '_');
      const timestamp = Date.now();
      return `report-${nameWithoutExt}-${timestamp}`;
    },
  },
});

module.exports = storage;

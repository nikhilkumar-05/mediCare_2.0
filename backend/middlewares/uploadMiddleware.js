const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');
        return {
            folder: 'medicare-uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
            resource_type: 'auto', // Important for PDFs to be processed correctly without forcing them strictly as 'image' or 'raw'
            transformation: isImage ? [{ width: 1000, crop: 'limit' }] : undefined,
        };
    },
});

const upload = multer({ storage: storage });

module.exports = upload;

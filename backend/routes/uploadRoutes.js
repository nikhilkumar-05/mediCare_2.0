const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');

// @desc    Upload a single file to Cloudinary
// @route   POST /api/upload
// @access  Private (Any authenticated user)
router.post('/', protect, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: req.file.path // The direct Cloudinary URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Upload Server Error' });
    }
});

module.exports = router;

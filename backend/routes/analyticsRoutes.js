const express = require('express');
const router = express.Router();
const { getAdminStats, getDoctorStats, getPatientStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // Apply to all routes

router.get('/admin', authorize('admin'), getAdminStats);
router.get('/doctor', authorize('doctor'), getDoctorStats);
router.get('/patient', authorize('patient'), getPatientStats);

module.exports = router;

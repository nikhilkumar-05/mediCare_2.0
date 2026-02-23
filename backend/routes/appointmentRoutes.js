const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    getAllAppointments,
    updateAppointmentStatus,
    getMyAppointments,
    addPrescription,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Base route: /api/appointments
router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/me', protect, getMyAppointments); // Unified route
router.get('/my-appointments', protect, authorize('patient'), getPatientAppointments);
router.get('/doctor-appointments', protect, authorize('doctor'), getDoctorAppointments);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);
router.put('/:id/prescription', protect, authorize('doctor'), addPrescription);

module.exports = router;


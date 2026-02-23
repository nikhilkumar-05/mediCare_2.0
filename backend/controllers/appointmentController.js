const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot, reasonForVisit } = req.body;

        // Verify doctor exists and has role 'doctor'
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Creating appointment will automatically fail (11000 duplicate key error) 
        // if the exact doctor, date, and timeslot exist due to the compound index.
        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId,
            date,
            timeSlot,
            reasonForVisit,
            status: 'Pending',
        });

        // Emit socket event to the doctor
        const io = req.app.get('io');
        if (io) {
            io.to(doctorId.toString()).emit('new_appointment', {
                message: `New appointment booked by patient for ${date} at ${timeSlot}`,
                appointmentId: appointment._id,
            });
        }

        res.status(201).json({ success: true, appointment });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'This slot is already booked.' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/my-appointments
// @access  Private/Patient
const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'firstName lastName email medicalProfile')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('doctor', 'firstName lastName email')
            .populate('patient', 'firstName lastName email medicalProfile')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Doctor/Admin
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized strictly to access this appointment' });
        }

        appointment.status = status || appointment.status;

        if (req.body.prescription) {
            appointment.prescription = req.body.prescription;
        }

        if (req.body.meetingLink) {
            appointment.meetingLink = req.body.meetingLink;
        }

        appointment = await appointment.save();

        // Emit socket event to the patient
        const io = req.app.get('io');
        if (io) {
            io.to(appointment.patient.toString()).emit('appointment_status_updated', {
                message: `Your appointment status has been updated to ${status}`,
                appointmentId: appointment._id,
                status: status
            });
        }

        res.json({ success: true, appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current user's appointments (Unified)
// @route   GET /api/appointments/me
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'patient') {
            query = { patient: req.user._id };
        } else if (req.user.role === 'doctor') {
            query = { doctor: req.user._id };
        } else if (req.user.role === 'admin') {
            query = {}; // Admin sees all
        }

        const appointments = await Appointment.find(query)
            .populate('doctor', 'firstName lastName email')
            .populate('patient', 'firstName lastName email medicalProfile')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add / update prescription for an appointment
// @route   PUT /api/appointments/:id/prescription
// @access  Private/Doctor
const addPrescription = async (req, res) => {
    try {
        const { prescription } = req.body;

        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Only the assigned doctor can add a prescription
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to prescribe for this appointment' });
        }

        appointment.prescription = prescription;
        appointment = await appointment.save();

        // Notify patient via socket
        const io = req.app.get('io');
        if (io) {
            io.to(appointment.patient.toString()).emit('prescription_added', {
                message: 'Your doctor has added a new prescription.',
                appointmentId: appointment._id,
            });
        }

        res.json({ success: true, appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    bookAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    getAllAppointments,
    updateAppointmentStatus,
    getMyAppointments,
    addPrescription,
};

const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalAppointments = await Appointment.countDocuments();

        // Appointments by Status
        const statusDistribution = await Appointment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent Appointments (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentAppointments = await Appointment.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            data: {
                users: {
                    patients: totalPatients,
                    doctors: totalDoctors,
                },
                appointments: {
                    total: totalAppointments,
                    recent: recentAppointments,
                    distribution: statusDistribution
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Doctor Dashboard Stats
// @route   GET /api/analytics/doctor
// @access  Private/Doctor
const getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.user._id;

        const totalAppointments = await Appointment.countDocuments({ doctor: doctorId });

        // Appointments by Status for this doctor
        const statusDistribution = await Appointment.aggregate([
            { $match: { doctor: doctorId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Upcoming vs Completed quick stats
        const upcomingCount = await Appointment.countDocuments({ doctor: doctorId, status: { $in: ['Pending', 'Approved'] } });
        const completedCount = await Appointment.countDocuments({ doctor: doctorId, status: 'Completed' });

        res.json({
            success: true,
            data: {
                totalAppointments,
                upcomingCount,
                completedCount,
                distribution: statusDistribution
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Patient Dashboard Stats
// @route   GET /api/analytics/patient
// @access  Private/Patient
const getPatientStats = async (req, res) => {
    try {
        const patientId = req.user._id;

        const totalAppointments = await Appointment.countDocuments({ patient: patientId });
        const upcomingAppointments = await Appointment.countDocuments({ patient: patientId, status: { $in: ['Pending', 'Approved'] } });

        res.json({
            success: true,
            data: {
                totalAppointments,
                upcomingAppointments
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getAdminStats,
    getDoctorStats,
    getPatientStats
};

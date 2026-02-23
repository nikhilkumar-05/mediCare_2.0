const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: role || 'patient', // Default to patient if no role is provided
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error.stack);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        // We need to explicitly select password because it is set to select: false in the model
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error.stack);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user profile (current logged in user)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        // req.user is set in the protect middleware
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                success: true,
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                specialty: user.specialty,
                experience: user.experience,
                bio: user.bio,
                consultationFee: user.consultationFee,
                medicalProfile: user.medicalProfile,
                updatedAt: user.updatedAt,
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all doctors
// @route   GET /api/auth/doctors
// @access  Private
const getDoctors = async (req, res) => {
    try {
        const { specialty } = req.query;
        let query = { role: 'doctor' };

        if (specialty) {
            query.specialty = new RegExp(specialty, 'i');
        }

        const doctors = await User.find(query).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.profilePic = req.body.profilePic || user.profilePic;

            if (user.role === 'doctor') {
                user.specialty = req.body.specialty || user.specialty;
                user.experience = req.body.experience || user.experience;
                user.bio = req.body.bio || user.bio;
                user.consultationFee = req.body.consultationFee || user.consultationFee;
            }

            if (user.role === 'patient') {
                user.medicalProfile = req.body.medicalProfile || user.medicalProfile;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            if (updatedUser.role === 'patient') {
                const io = req.app.get('io');
                if (io) {
                    const Appointment = require('../models/Appointment');
                    // Notify doctors who have active appointments with this patient
                    const activeAppointments = await Appointment.find({ patient: updatedUser._id, status: 'Pending' });
                    const doctorIds = [...new Set(activeAppointments.map(a => a.doctor.toString()))];

                    doctorIds.forEach(docId => {
                        io.to(docId).emit('patient_profile_updated', {
                            message: `${updatedUser.firstName} ${updatedUser.lastName} has just uploaded a new diagnostic report.`,
                            patientId: updatedUser._id
                        });
                    });
                }
            }

            res.json({
                success: true,
                _id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role,
                profilePic: updatedUser.profilePic,
                specialty: updatedUser.specialty,
                experience: updatedUser.experience,
                bio: updatedUser.bio,
                consultationFee: updatedUser.consultationFee,
                medicalProfile: updatedUser.medicalProfile,
                token: generateToken(updatedUser._id, updatedUser.role),
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getDoctors,
    updateProfile,
};

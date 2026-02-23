const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please add a first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please add a last name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'doctor', 'patient'],
            default: 'patient',
        },
        profilePic: {
            type: String,
            default: '',
        },
        // Doctor specific fields
        specialty: {
            type: String,
            trim: true,
        },
        experience: {
            type: Number,
        },
        bio: {
            type: String,
            trim: true,
        },
        consultationFee: {
            type: Number,
            default: 0,
        },
        // Patient specific fields (EHR Lite)
        medicalProfile: {
            bloodGroup: { type: String },
            allergies: [String],
            chronicConditions: [String],
            currentMedications: [String],
            reports: [
                {
                    name: String,
                    url: String,
                    date: { type: Date, default: Date.now }
                }
            ],
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

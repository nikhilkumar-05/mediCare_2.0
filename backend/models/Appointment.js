const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: String, // Storing as YYYY-MM-DD for simple string-based unique indexing
            required: true,
        },
        timeSlot: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        reasonForVisit: {
            type: String,
        },
        meetingLink: {
            type: String,
            trim: true,
        },
        prescription: {
            medications: [
                {
                    name: String,
                    dosage: String,
                    duration: String,
                }
            ],
            notes: String,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent double-booking specific time slots for a specific doctor
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

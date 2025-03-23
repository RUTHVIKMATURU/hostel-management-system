const mongoose = require('mongoose');

const outpassSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true },
    outTime: { type: Date, required: true },
    inTime: { type: Date, required: true },
    reason: { type: String, required: true },
    type: {
        type: String,
        enum: ['late pass', 'home pass'],
        required: true
    },
    studentMobileNumber: { type: String, required: true },
    parentMobileNumber: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

const Outpass = mongoose.model('Outpass', outpassSchema);

module.exports = Outpass;

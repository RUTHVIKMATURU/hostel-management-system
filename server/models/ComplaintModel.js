// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['network related', 'food', 'water', 'power cut', 'cleaning', 'plumbing related', 'electrician related', 'carpenter related'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    complaintBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'solved'],
        default: 'active'
    },
    adminReply: {
        type: String,
        default: null
    }
}, { timestamps: true });

const ComplaintModel = mongoose.model('Complaint', complaintSchema);


module.exports=ComplaintModel;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4]
    },
    profilePhoto: {
        type: String, 
        default: null
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
      type: String,
      required: true
    },
    parentMobileNumber: {
        type: String,
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;

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
        required: true,
        minlength: 6
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

// Pre-save middleware to hash password
studentSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate a salt with cost factor 10
        const salt = await bcrypt.genSalt(10);
        // Hash password with new salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Add method to compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;

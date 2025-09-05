const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    // Only hash if password is modified or new
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Add logging for debugging
        console.log('Comparing passwords:');
        console.log('Candidate password:', candidatePassword);
        console.log('Stored hashed password:', this.password);
        
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        console.log('Password match result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Password comparison error:', error);
        throw error;
    }
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;


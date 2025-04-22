require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/AdminModel');

mongoose.connect(process.env.DBURL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

async function createAdmin() {
    try {
        const adminData = {
            username: "admin123",
            password: "123456",  // Will be automatically hashed
            name: "Admin User",
            role: "admin"
        };

        // Delete existing admin if exists
        await Admin.deleteOne({ username: adminData.username });
        console.log('Deleted existing admin if any');

        const admin = new Admin(adminData);
        await admin.save();
        
        console.log('Admin created successfully');
        console.log('Admin details (including hashed password):', admin.toObject());
        
        // Verify password comparison works
        const testPassword = await admin.comparePassword("123456");
        console.log('Password verification test:', testPassword);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

createAdmin();

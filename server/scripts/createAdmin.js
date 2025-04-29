const mongoose = require('mongoose');
const Admin = require('../models/AdminModel');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log('Connected to database');

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
        console.log('Admin details:', {
            username: admin.username,
            name: admin.name,
            role: admin.role
        });
        
        // Verify password comparison works
        const testPassword = await admin.comparePassword("123456");
        console.log('Password verification test:', testPassword);

        if (testPassword) {
            console.log('Password verification successful');
        } else {
            console.log('Password verification failed');
        }

        await mongoose.disconnect();
        console.log('Disconnected from database');

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();


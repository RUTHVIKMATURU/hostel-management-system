const express = require('express');
const adminApp = express.Router();
const Student = require('../models/StudentModel');
const expressAsyncHandler = require('express-async-handler');
const Announcement = require('../models/AnnouncementModel');
const CommunityPost = require('../models/CommunityPostModel');
const Complaint = require('../models/ComplaintModel');
const Outpass = require('../models/OutpassModel');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel');
const { verifyAdmin } = require('../middleware/adminMiddleware');





// APIs
adminApp.get('/', (req, res) => {
    res.send('message from Admin API');
});

// Add this new endpoint
adminApp.post('/login', expressAsyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Debug log
        console.log('Login attempt for username:', username);
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username and password are required" 
            });
        }

        // Find admin
        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            console.log('Admin not found:', username);
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        console.log('Admin found:', {
            username: admin.username,
            hashedPassword: admin.password
        });

        // Compare password
        const isMatch = await admin.comparePassword(password);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: admin._id, 
                role: 'admin',
                username: admin.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                name: admin.name,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}));

// Protected routes
adminApp.use(verifyAdmin);

// create new student profile
adminApp.post('/student-register', expressAsyncHandler(async (req, res) => {
    try {
        const { name, rollNumber, branch, year, profilePhoto, phoneNumber, email, parentMobileNumber, roomNumber, password } = req.body;

        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists" });
        }

        const newStudent = new Student({
            name,
            rollNumber,
            branch,
            year,
            profilePhoto,
            phoneNumber,
            email,
            parentMobileNumber,
            roomNumber,
            password,
            is_active: true
        });

        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully", student: newStudent });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to deactivate a student-profile
adminApp.put('/student-delete', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber } = req.body;

        const student = await Student.findOneAndUpdate(
            { rollNumber },
            { is_active: false },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deactivated successfully", student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to get all active students
adminApp.get('/get-active-students',expressAsyncHandler(async (req, res) => {
    try {
        const activeStudents = await Student.find({ is_active: true });
        res.status(200).json(activeStudents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to get all inactive students
adminApp.get('/get-inactive-students',expressAsyncHandler(async (req, res) => {
    try {
        const activeStudents = await Student.find({ is_active: false });
        res.status(200).json(activeStudents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));


// to post an announcement
adminApp.post('/post-announcement',expressAsyncHandler(async (req, res) => {
    try {
        const { title,description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newAnnouncement = new Announcement({ title,description });
        await newAnnouncement.save();

        res.status(201).json({ message: "Announcement posted successfully", announcement: newAnnouncement });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to edit announcement
adminApp.put('/edit-announcement/:id',expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            { description },
            { new: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})); 


// to read announcement
adminApp.get('/all-announcements',expressAsyncHandler(async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}))

// to read today's announcements
adminApp.get('/announcements',expressAsyncHandler(async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const announcements = await Announcement.find({
            createdAt: { $gte: today }
        });

        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}))


// // to post community message
// adminApp.post('/post-community-message', expressAsyncHandler(async (req, res) => {
//     try {
//         const { content, images, postedBy, category } = req.body;

//         const newPost = new CommunityPost({ content, images, postedBy, category });

//         await newPost.save();

//         res.status(201).json({ message: "Community message posted successfully", post: newPost });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }));

// to read community messages
adminApp.get('/get-community-messages', expressAsyncHandler(async (req, res) => {
    try {
        const communityPosts = await CommunityPost.find().sort({ createdAt: -1 });

        res.status(200).json(communityPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));


//  // complaints section

// to read all complaints
adminApp.get('/get-complaints', expressAsyncHandler(async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to read active complaints
adminApp.get('/get-active-complaints', expressAsyncHandler(async (req, res) => {
    try {
        const activeComplaints = await Complaint.find({ status: 'active' }).sort({ createdAt: -1 });
        res.status(200).json(activeComplaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to update complaint status to solved
adminApp.put('/mark-complaint-solved/:id', expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { status: 'solved' },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint marked as solved", complaint: updatedComplaint });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));


// handle the outpasses
adminApp.put('/update-outpass-status/:id', expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use 'accepted' or 'rejected'." });
        }

        const updatedOutpass = await Outpass.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOutpass) {
            return res.status(404).json({ message: "Outpass not found" });
        }

        res.status(200).json({ message: `Outpass ${status} successfully`, outpass: updatedOutpass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to read all pending outpasses
adminApp.get('/pending-outpasses', expressAsyncHandler(async (req, res) => {
    try {
        const pendingOutpasses = await Outpass.find({ status: 'pending' });
        res.status(200).json({ pendingOutpasses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// Update student details
adminApp.put('/student-update/:rollNumber', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber } = req.params;
        const updateData = req.body;
        
        // Remove sensitive fields that shouldn't be updated
        delete updateData.password;
        delete updateData.rollNumber;
        
        const updatedStudent = await Student.findOneAndUpdate(
            { rollNumber },
            updateData,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// Bulk actions on students
adminApp.post('/students/bulk', expressAsyncHandler(async (req, res) => {
    try {
        const { students, action } = req.body;
        
        if (!students || !students.length) {
            return res.status(400).json({ message: "No students selected" });
        }

        const isActive = action === 'activate';
        
        await Student.updateMany(
            { rollNumber: { $in: students } },
            { $set: { is_active: isActive } }
        );

        res.status(200).json({ 
            message: `Successfully ${action}d ${students.length} students` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// Get all students with pagination and filters
adminApp.get('/students', verifyAdmin, expressAsyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        
        let query = {};
        
        if (status) {
            query.is_active = status === 'active';
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const students = await Student.find(query)
            .select('-password')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .exec();

        const count = await Student.countDocuments(query);

        res.status(200).json({
            students,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalStudents: count
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch students',
            error: error.message 
        });
    }
}));



module.exports = adminApp;

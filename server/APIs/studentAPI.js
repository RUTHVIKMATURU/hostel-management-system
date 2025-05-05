const exp = require('express');
const expressAsyncHandler = require('express-async-handler');
const studentApp = exp.Router();
const Announcement = require('../models/AnnouncementModel');
const Complaint = require('../models/ComplaintModel');
const CommunityPost = require('../models/CommunityPostModel');
const Outpass = require('../models/OutpassModel');
const jwt = require('jsonwebtoken');
const Student = require('../models/StudentModel');
// const { verifyStudent } = require('../middleware/verifyStudentMiddleware');
require('dotenv').config();

// Add this at the top of your routes
studentApp.get('/test', (req, res) => {
    res.json({ message: "Student API is working" });
});

// APIs
studentApp.get('/', (req, res) => {
    res.send('message from Student API');
});


studentApp.post('/login', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber, password } = req.body;
        
        // Validate input
        if (!rollNumber || !password) {
            return res.status(400).json({ 
                message: "Roll number and password are required" 
            });
        }

        // Find student
        const student = await Student.findOne({ rollNumber });
        
        if (!student) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        // Check if account is active
        if (!student.is_active) {
            return res.status(401).json({ 
                message: "Account is inactive" 
            });
        }

        // Compare password using the method we added to the schema
        const passwordMatch = await student.comparePassword(password);
        

        if (!passwordMatch) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: student._id, 
                role: 'student',
                rollNumber: student.rollNumber 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                branch: student.branch,
                year: student.year,
                phoneNumber: student.phoneNumber,
                email: student.email,
                parentMobileNumber: student.parentMobileNumber,
                roomNumber: student.roomNumber,
                profilePhoto: student.profilePhoto
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}));



// to read announcement
studentApp.get('/all-announcements',expressAsyncHandler(async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}))

// to read today's announcements
studentApp.get('/announcements',expressAsyncHandler(async (req, res) => {
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

// to post a general complaint
studentApp.post('/post-complaint', expressAsyncHandler(async (req, res) => {
    try {
        const { category, description, complaintBy } = req.body;

        const newComplaint = new Complaint({
            category,
            description,
        
            complaintBy
        });

        await newComplaint.save();
        res.status(201).json({ message: "Complaint posted successfully", complaint: newComplaint });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to get all complaints posted by the student
studentApp.get('/get-complaints/:rollNumber', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber } = req.params;
        console.log('Fetching complaints for roll number:', rollNumber);
        
        const complaints = await Complaint.find({ complaintBy: rollNumber }).sort({ createdAt: -1 });
        console.log('Found complaints:', complaints.length);
        
        // Return the array directly
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error in get-complaints:', error);
        res.status(500).json({ error: error.message });
    }
}));



// to post community message
studentApp.post('/post-community-message', expressAsyncHandler(async (req, res) => {
    try {
        const { content, postedBy, category } = req.body;

        const newPost = new CommunityPost({ content, postedBy, category });

        await newPost.save();

        res.status(201).json({ message: "Community message posted successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to read community messages
studentApp.get('/get-community-messages', expressAsyncHandler(async (req, res) => {
    try {
        const communityPosts = await CommunityPost.find().sort({ createdAt: -1 });

        res.status(200).json(communityPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// apply for outpass
studentApp.post('/apply-outpass', expressAsyncHandler(async (req, res) => {
    try {
        const { name, rollNumber, outTime, inTime, studentMobileNumber, parentMobileNumber, reason, type } = req.body;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const acceptedOutpassCount = await Outpass.countDocuments({
            rollNumber,
            month: currentMonth,
            year: currentYear,
            status: 'accepted'
        });

        if (acceptedOutpassCount >= 6) {
            return res.status(400).json({ message: "Outpass limit reached for this month." });
        }

        const newOutpass = new Outpass({
            name,
            rollNumber,
            outTime,
            inTime,
            studentMobileNumber,
            parentMobileNumber,
            reason,
            type,
            month: currentMonth,
            year: currentYear,
            status: 'pending'
        });

        await newOutpass.save();
        res.status(201).json({ message: "Outpass request submitted successfully", outpass: newOutpass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

// to get all the outpasses applied by the student
studentApp.get('/all-outpasses/:rollNumber', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber } = req.params;
        const studentOutpasses = await Outpass.find({ rollNumber });
        // Always return 200 with the results, even if empty
        res.status(200).json({ studentOutpasses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));

studentApp.post('/signup', expressAsyncHandler(async (req, res) => {
    try {
        const { 
            name, rollNumber, branch, year, phoneNumber, 
            email, parentMobileNumber, roomNumber, password 
        } = req.body;
        
        // Check for existing student
        const existingStudent = await Student.findOne({ 
            $or: [{ rollNumber }, { email }] 
        });
        
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Student already exists with this roll number or email" 
            });
        }

        // Create new student - password will be hashed by pre-save middleware
        const newStudent = new Student({
            name,
            rollNumber,
            branch,
            year: parseInt(year),
            phoneNumber,
            email,
            parentMobileNumber,
            roomNumber,
            password,
            is_active: true
        });

        const savedStudent = await newStudent.save();
        

        res.status(201).json({ 
            message: "Student registered successfully", 
            student: {
                id: savedStudent._id,
                name: savedStudent.name,
                rollNumber: savedStudent.rollNumber,
                email: savedStudent.email
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));



module.exports = studentApp;

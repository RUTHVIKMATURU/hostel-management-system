const exp = require('express');
const expressAsyncHandler = require('express-async-handler');
const studentApp = exp.Router();
const Announcement = require('../models/AnnouncementModel');
const Complaint = require('../models/ComplaintModel');
const CommunityPost = require('../models/CommunityPostModel');
const Outpass = require('../models/OutpassModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('../models/StudentModel');
// const { verifyStudent } = require('../middleware/verifyStudentMiddleware');
require('dotenv').config();



// APIs
studentApp.get('/', (req, res) => {
    res.send('message from Student API');
});


studentApp.post('/login', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber, password } = req.body;

        const student = await Student.findOne({ rollNumber, is_active: true });
        if (!student || !(await bcrypt.compare(password, student.password))) {
            return res.status(401).json({ message: "Invalid credentials or inactive account" });
        }

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                branch: student.branch,
                year: student.year,
                profilePhoto: student.profilePhoto,
                phoneNumber: student.phoneNumber,
                email: student.email,
                parentMobileNumber: student.parentMobileNumber,
                roomNumber: student.roomNumber,
                is_active: student.is_active
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const complaints = await Complaint.find({ complaintBy: rollNumber }).sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
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
// Get all outpass requests by a student's roll number
studentApp.get('/all-outpasses/:rollNumber', expressAsyncHandler(async (req, res) => {
    try {
        const { rollNumber } = req.params;
        const studentOutpasses = await Outpass.find({ rollNumber });
        if (!studentOutpasses.length) {
            return res.status(404).json({ message: 'No outpass requests found for this student' });
        }
        res.status(200).json({ studentOutpasses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}));




module.exports = studentApp;

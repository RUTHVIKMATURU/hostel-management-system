const exp = require('express');
const adminApp = exp.Router();
const Student = require('../models/StudentModel');
const expressAsyncHandler = require('express-async-handler');
const Announcement = require('../models/AnnouncementModel');
const CommunityPost = require('../models/CommunityPostModel');
const Complaint = require('../models/ComplaintModel');
const Outpass = require('../models/OutpassModel');




// APIs
adminApp.get('/', (req, res) => {
    res.send('message from Admin API');
});


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





module.exports = adminApp;
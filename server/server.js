const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const adminApp = require('./APIs/adminAPI');
const studentApp = require('./APIs/studentAPI');

// middleware
app.use(cors())

// body parser middleware
app.use(express.json()) 

// Define the port
const port = process.env.PORT || 3000;

// API routes
app.use('/student-api', studentApp);
app.use('/admin-api', adminApp);

// DB connection
mongoose.connect(process.env.DBURL)
.then(() => {
    app.listen(port, () => console.log(`server listening on port ${port}...`))
    console.log("DB connection success")
})
.catch(err => {
    console.log("error in DB connection", err);
})

const exp = require('express');
const app = exp();
require('dotenv').config();
const mongoose = require('mongoose');
const cors=require('cors')



const adminApp = require('./APIs/adminAPI');
const studentApp = require('./APIs/studentAPI');
// const complaintApp = require('./APIs/complaintAPI');


// middleware
app.use(cors())

// body parser middleware
app.use(exp.json()) 



const port=process.env.PORT || 4000;

// DB connection
mongoose.connect(process.env.DBURL)
.then(()=>{
    app.listen(port,()=> console.log(`server listening on port ${port}... `))
    console.log("DB connection success")

})
.catch(err=>{
    console.log("error in DB connection", err);
})




// Api connection
app.use('/student-api',studentApp)
app.use('/admin-api', adminApp)
// app.use('/complaint-api',complaintApp)



// app.use('/uploads', express.static('uploads'));
// app.use('/api/admin', adminRoutes);
// app.use('/api/student', studentRoutes);
// app.use('/api/complaints', complaintRoutes);


// error handler
app.use((err,req,res,next)=>{
    console.log("err object in express error handler :",err)
    res.send({message:err.message})
})

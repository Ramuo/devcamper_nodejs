const path = require('path');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');


// Connect to detabase
connectDB();
// ROUTE FILES
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// INITIATE EXPRESS APP VARIABLE
const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//MIDDLEWEARE
// Dev logging Middleware
if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers using app middlewear
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

// LISTEN SERVER
 //const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    );

// TO HANDLE  UNHANDLED PROMISE REJECTIONS

process.on('unhandledRejection', (err, promise)=> {
    console.log(`Error: ${err.message}`.red);

    // Close server and exit process
    server.close(()=>process.exit(1));
})
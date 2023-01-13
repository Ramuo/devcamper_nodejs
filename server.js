const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db')


// INITIATE EXPRESS APP VARIABLE
const app = express();
//Body parser
app.use(express.json())


// Connect to detabase
connectDB();

// ROUTE FILES
const bootcamps = require('./routes/bootcamps')

//MIDDLEWEARE
// Dev logging Middleware
if(process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'));
}

// Mount routers using app middlewear
app.use('/api/v1/bootcamps', bootcamps);



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
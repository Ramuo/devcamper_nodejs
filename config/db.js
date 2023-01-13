
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const dotenv = require('dotenv');


// Load env vars
dotenv.config({ path: `./config/.env`});
NODE_ENV= process.env.NODE_ENV;
PORT= process.env.PORT
const MONGO_URI = process.env.MONGO_URI


const connectDB = () => {
    mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => console.log(`MongoDB Connected`))
    .catch(err => console.log(err))

}

module.exports = connectDB;






    
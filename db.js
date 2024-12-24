const mongoose = require('mongoose');

const connectToDb = async() => {
    try{
        await mongoose.connect(process.env.MongoDbUri);
        console.log("connected to DB");
    }catch(error){
        console.log(error)
    }
}

module.exports = connectToDb;
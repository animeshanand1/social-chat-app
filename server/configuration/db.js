const mongoose=require('mongoose');
// mongodb connection
const mongoURI='mongodb://127.0.0.1:27017/luminate';
const connectDB=async()=>{
    try {
        console.log('Connecting to MongoDB');
        const conn=await mongoose.connect(mongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('Connection Failed');
        console.error(error.message);
    }
}
module.exports=connectDB;
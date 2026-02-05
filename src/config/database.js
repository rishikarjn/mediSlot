const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
      "mongodb+srv://rishikasingh2109_db_user:RISHrish2123ika@devsphere.ezdk9or.mongodb.net/medislot"
    

    );
    // console.log("Connected DB:", mongoose.connection.name);

};

module.exports=connectDB;
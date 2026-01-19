const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
      "mongodb+srv://rishikasingh2109_db_user:RISHrish2123ika@devsphere.ezdk9or.mongodb.net/?appName=mediSlot"
    );
};

module.exports=connectDB;
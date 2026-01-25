const express=require("express");
const connectDB=require("./config/database");
const app=express();

app.use(express.json());

connectDB()
.then(()=>{
    console.log("Database connection established...");
    app.listen(2123,()=>{
     console.log("Server is successfully listening on port 2123...");

    });
})
.catch((err)=>{
    console.error("Database cannot be connected");
});
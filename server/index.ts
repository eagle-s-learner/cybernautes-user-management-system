import express from "express";
import dotenv  from "dotenv";
dotenv.config();

const app = express();


const port = process.env.PORT || 6001;

app.listen(port, (err) => {
    if(err){
        console.log(err)
    }
    console.log(`Server is running on port: ${port}`);
})
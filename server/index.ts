import express from "express";
import dotenv  from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import usersRoutes from "./routes/users";

const app = express();

app.use(bodyParser.json())

app.use('/api', usersRoutes);


const port = process.env.PORT || 6001;

app.listen(port, (err) => {
    if(err){
        console.log(err)
    }
    console.log(`Server is running on port: ${port}`);
})
import { Request, Response } from "express";

// interface Users {
//     name:number
// }

function getUsers(req: Request, res: Response){
    const {name} = req.body;
    console.log(name);
    res.send("hello working fine");
}

export {getUsers};
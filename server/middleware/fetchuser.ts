import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();
const JWT_SECRET: string = process.env.JWT_SECRET || "";
const fetchuser = async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.header("authToken");
    if (authToken) {
        try {
            const data = await jwt.verify(authToken, JWT_SECRET);
            if (typeof data === 'object' && data !== null && 'username' in data) {
                req.body.username = data.username;
                next();
            } else {
                res.json({ success: false, err: ["Invalid authToken"] });
            }
        } catch (err) {
            res.json({ success: false, err });
        }
    } else {
        res.json({ success: false, err: ["authToken Not Exist"] });
    }
};

export default fetchuser;
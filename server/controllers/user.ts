import { Request, Response } from "express"
import User from "../models/User";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
require("dotenv").config();
const JWT_SECRET: string = process.env.JWT_SECRET || "";
const signup = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.json({ success: false, err: error.array() });
    } else {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user != null) {
            res.json({ success: false, err: ["Username Already Exist"] });
        } else {
            const salt = await bcryptjs.genSalt(10);
            const hashPassword = await bcryptjs.hash(password, salt);
            await User.create({ username, password: hashPassword });
            const authToken = await jwt.sign({ username }, JWT_SECRET);
            res.send({ success: true, authToken });
        }
    }

};
const login = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.json({ success: false, err: error.array() });
    } else {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user == null) {
            res.json({ success: false, err: ["User Doesn't Exist"] });
        } else {
            const isMatch = await bcryptjs.compare(password, user.password || "");
            if (!isMatch) {
                res.json({ success: false, err: ["Incorrect Password"] });
            } else {
                const authToken = await jwt.sign({ username }, JWT_SECRET);
                res.send({ success: true, authToken });
            }
        }
    }
};


export { login, signup };
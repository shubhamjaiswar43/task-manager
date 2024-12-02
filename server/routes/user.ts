import { Router } from "express";
import { login, signup } from "../controllers/user";
import { body } from "express-validator";

const route = Router()
route.post('/signup', [
    body("username", "Username Doesn't Exist").exists(),
    body("username", "Username Can't Contain Special Characters").isAlphanumeric(),
    body("password", "Minimum Length for password is 8").isLength({ min: 8 }),
], signup);

route.post('/login', [
    body("username", "Username Doesn't Exist").exists(),
    body("password", "Minimum Length for password is 8").isLength({ min: 8 }),
], login);

export default route;
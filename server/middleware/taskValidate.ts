import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
const taskValidate =
    [
        body("title", "title doesn't exist").exists(),
        body("priority", "priority doesn't exist").exists(),
        body("status", "status doesn't exist").exists(),
        body("startDate","start Date should be date").isISO8601(),
        body("endDate","endDate should be date").isISO8601(),
        (req: Request, res: Response, next: NextFunction) => {
            const err = validationResult(req);
            if (err.isEmpty()) {
                next();
            } else {
                res.json({ success: false, err: err.array() });
            }
        }
    ]



export { taskValidate };
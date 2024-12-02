import express, { Request, Response } from "express";
import userRoute from "./routes/user";
import taskRoute from "./routes/task";
import connect from "./db";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 3001;
connect();
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req: Request, res: Response) => {
    res.send("Welcome To Task Management Web!!");
});
app.use('/', userRoute);
app.use('/task', taskRoute);

app.listen(PORT, () => {
    console.log(`Server is running at at http://localhost:${PORT}`);
});

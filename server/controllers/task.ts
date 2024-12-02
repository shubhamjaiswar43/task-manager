import { Request, Response } from "express";
import Task from "../models/Task";
import User from "../models/User";
const getCurrentFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${date}T${hours}:${minutes}`;
};
const addTask = async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        const taskId = user.taskAdded + 1;
        const task = {
            taskId,
            ...req.body
        }
        await Task.create(task);
        user.taskAdded = user.taskAdded + 1;
        await user.save();
        res.json({ success: true, msg: 'task added successfully' });
    } else {
        res.json({ success: false, err: ["user doesn't exist "] });
    }
};
const editTask = async (req: Request, res: Response) => {
    const username = req.body.username;
    const taskId = req.params.id;
    const previousTask = await Task.findOne({ username, taskId });
    if (previousTask) {
        const task = {
            taskId,
            ...req.body
        }
        await Task.replaceOne({ username: req.body.username, taskId }, task);
        res.json({ success: true, msg: 'task edited successfully' });
    } else {
        res.json({ success: false, err: ["task doesn't exist"] })
    }
};
const deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.id;
    await Task.deleteOne({ username: req.body.username, taskId });
    res.json({ success: true, msg: "task deleted successfully" });
};
const getTask = async (req: Request, res: Response) => {
    const username = req.body.username;
    if (req.params.id) {
        const taskId = req.params.id;
        const task = await Task.findOne({ username, taskId });
        res.json({ success: true, task });
    } else {
        const tasks = await Task.find({ username });
        res.json({ success: true, tasks });
    }
};

export { addTask, editTask, deleteTask, getTask };
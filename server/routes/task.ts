import { Router } from "express";
import fetchuser from "../middleware/fetchuser";
import { taskValidate } from "../middleware/taskValidate";
import { addTask, editTask, deleteTask, getTask } from "../controllers/task";
const route = Router()
route.post('/', taskValidate, fetchuser, addTask);
route.patch('/:id', taskValidate, fetchuser, editTask);
route.delete('/:id', fetchuser, deleteTask);
route.get('/', fetchuser, getTask);
route.get('/:id', fetchuser, getTask);
export default route;
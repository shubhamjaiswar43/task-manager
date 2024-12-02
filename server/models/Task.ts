import mongoose, { mongo, Schema } from "mongoose";

const task = new Schema({
    username: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    taskId: {
        type: Number,
        require: true
    },
    priority: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
});
export default mongoose.model("task", task);

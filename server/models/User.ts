import mongoose, { Schema } from "mongoose";

const user = new Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    taskAdded: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("user", user);

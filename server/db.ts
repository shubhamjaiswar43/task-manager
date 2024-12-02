import mongoose from "mongoose";
require("dotenv").config();
const mongouri: string = process.env.MONGOURI || "";
const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(mongouri);
        console.log(`Database Connected Successfully`);
    } catch (err) {
        console.log(err)
        console.log("Error In Connection")
    }
}


export default connect;
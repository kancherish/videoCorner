import mongoose from "mongoose";

import { MONGO_URI, DB_NAME } from "../config/env.js";


const connectDB = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`MONGO DB CONNECTED AT ${connectionInstance.connection.id}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB;

import {config} from "dotenv"

config({path:".env"})

export const {PORT,ORIGIN,MONGO_URI,DB_NAME} = process.env
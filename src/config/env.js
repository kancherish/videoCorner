import {config} from "dotenv"

config({path:".env"})

export const {
    PORT,ORIGIN,MONGO_URI,DB_NAME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRY,
    JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY

} = process.env
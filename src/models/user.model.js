import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_SECRET } from "../config/env";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String, // cloudinary url
    },
    watchHistrory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }
},{
    timestamps:true
})

userSchema.pre("save",async function() {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName
        },
        JWT_ACCESS_TOKEN_SECRET,
        {expiresIn:JWT_ACCESS_TOKEN_EXPIRY}
)
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id:this._id
        },
        JWT_REFRESH_TOKEN_SECRET,
        {expiresIn:JWT_REFRESH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User",userSchema)

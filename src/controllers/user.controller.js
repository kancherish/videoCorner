import { User } from "../models/user.model.js";
import uploadOnCloudinary, { DeleteFromCloudinary } from "../config/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { JWT_REFRESH_TOKEN_SECRET } from "../config/env.js";


//global variables for extending scoping
let coverImagePath;
let avatarPath;

const generateRefreshAndAccessToken = async (userId) => {
   try {

      const user = await User.findById(userId)

      if (!user) {
         throw new Error("User Doesn't Exists")
      }

      const accessToken = User.generateAccessToken()
      const refreshToken = User.generateRefreshToken()

      user.refreshToken = refreshToken

      await user.save({ validationBeforeSave: false })

      return { accessToken, refreshToken }

   } catch (error) {
      console.log(error)
      throw error
   }
}


const registerUser = async (req, res, next) => {

   try {
      const { email, username, password, fullName } = req.body;

      const values = [email, username, password, fullName];

      if ((values.length === 0 || (values.some((value) => value ? value.trim() === "" : false)))) {
         const error = new Error("USER REGISTRATION FAILED DUE TO MISSING FIELDS");
         error.statusCode = 406;
         throw error;
      }

      const existedUser = await User.findOne({
         $or: [{ username }, { email }]
      })

      if (existedUser) {
         const error = new Error("user with username or email already exists")
         error.statusCode = 409
         throw error
      }

      const avatarLocalPath = req.files?.avatar?.[0].path

      if (!avatarLocalPath) {

         const error = new Error("avatar image is missing")
         error.statusCode = 406
         throw error
      }

      const coverImageLocalPath = req.files?.coverImage?.[0].path

      avatarPath = await uploadOnCloudinary(avatarLocalPath);

      if (!avatarPath) {
         const error = new Error("failed to upload avatar image")
         error.statusCode = 500
         throw error
      }

      if (coverImageLocalPath) {
         coverImagePath = await uploadOnCloudinary(coverImageLocalPath);
      }

      if (coverImageLocalPath && !coverImagePath) {
         const error = new Error("failed to upload Cover image")
         error.statusCode = 500
         throw error
      }

      const createdUser = await User.insertOne({ fullName, username, email, password, avatar: avatarPath.url, coverImage: coverImagePath.url })

      const foundUser = await User.findById(createdUser._id).select(["-password", "-refreshToken"])

      if (!foundUser) {
         const error = new Error("Something went wrong")
         error.statusCode = 500
         throw error
      }

      return res.status(200).json(new ApiResponse(200, foundUser, "User Registred succesfulyy"))

   } catch (error) {
      if (avatarPath) {
         await DeleteFromCloudinary(avatarPath.public_id)
      }
      if (coverImagePath) {
         await DeleteFromCloudinary(coverImagePath.public_id)
      }
      console.log(error)
      next(error)
   }

}


const loginUser = async (req, res) => {

   const { username, email, password } = req.body

   if (!username || !email || !password) {
      const error = new Error("missing field")
      error.statusCode = 406
      throw error
   }

   const user = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (!user) {
      const error = new Error("User doesnt exist")
      error.statusCode = 404
      throw error
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
      const error = new Error("Invalid Password")
      error.statusCode = 401
      throw error
   }

   const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, loggedInUser, "User Logged In"))


}


const logoutUser = async (req, res) => {
   await User.findOneAndUpdate(req.user._id,
      {
         $unset:{
            refreshToken : 1
         }
      }
   )


    const options = {
        httpOnly: true,
        secure: true
    }

    req
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(200,{},"User Logged Out")

}


const refreshAccessToken = async (req, res) => {
   let refreshToken;
   if (req.cookie.refreshToken) {
      refreshToken = req.cookie.refreshToken
   }
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      refreshToken = req.headers.authorization.split(' ')[1]
   }
   if (!refreshToken) {
      return res.status(401).json(new ApiResponse(401, {}, "User Not Authorized"))
   }

   const decodedRefreshToken = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET)
   const user = await User.findById(decodedRefreshToken?._id)

   if (!user) {
      const error = new Error("No User Found")
      error.statusCode = 404
      throw error
   }

   if (user.refreshToken !== refreshToken) {
      const error = new Error("Token expired login again")
      error.statusCode = 400
      throw error
   }

   const { accessToken, refreshToken: newRefreshToken } = generateRefreshAndAccessToken(user._id)

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "User Token Refreshed"))

}

export { registerUser, loginUser, refreshAccessToken, logoutUser }
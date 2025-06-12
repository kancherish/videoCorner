import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import Upload from "../middleware/multer.middleware.js"
import checkRefreshToken from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register",Upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser)

userRouter.post("/login",loginUser)

userRouter.post("/logout",checkRefreshToken,logoutUser)


export default userRouter
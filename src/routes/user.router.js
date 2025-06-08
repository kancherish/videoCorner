import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import Upload from "../middleware/multer.middleware.js"

const userRouter = Router();

userRouter.get("/register",Upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser)


export default userRouter
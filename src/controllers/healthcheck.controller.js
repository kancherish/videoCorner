import asyncHandeler from "../utils/asyncHandeler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const healthCheckController = asyncHandeler((req,res,next)=>{
    res.status(200).json(new ApiResponse(200,"server running"))
})

export default healthCheckController
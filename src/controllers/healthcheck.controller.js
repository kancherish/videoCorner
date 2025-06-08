import { ApiResponse } from "../utils/ApiResponse.js"

const healthCheckController = (req,res,next)=>{
    res.status(200).json(new ApiResponse(200,"server running"))
}

export default healthCheckController
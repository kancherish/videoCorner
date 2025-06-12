import { JWT_REFRESH_TOKEN_SECRET } from "../config/env.js";
import User from "../../../backend01/models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse";


const checkRefreshToken = async (req, _, next) => {
    try {
        let token;
        if (req.cookie.refreshToken) {
            token = req.cookie.refreshToken
        }
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) {
            return res.status(401).json(new ApiResponse(401,{},"User Not Authorized"))
        }

        const decoded = jwt.verify(token,JWT_REFRESH_TOKEN_SECRET)

        const user = await User.findById(decoded._id)

        if (!user && user.refreshToken === token) {
            return res.status(419).json(new ApiResponse(419,{},"Expired Token"))
        }

        req.user = user

        next()

    } catch (error) {
        throw new Error("error while authorizing through token")
    }

}

export default checkRefreshToken
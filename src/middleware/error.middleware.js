import { ErrorResponse } from "../utils/ErrorResponse.js";

const errorMiddleware = (error, req, res, next) => {
    try {    
        
        
        //if mongodb bad objectId
        if (error.name === "CastError") {
            const message = "Resource Not Found";
            error = new Error(message);
            error.statusCode = 404;
        }

        //if objectid already exist
        if (error.code === "11000") {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }
        
        res.status(error.statusCode || 500).json(new ErrorResponse((error.statusCode || 500), error.message, error.errors, error.stack));
    } catch (error) {
        console.error("CRITICAL ERROR IN ERROR HANDLER:", error)
        if (!res.headersSent) {
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }
    }

}

export default errorMiddleware;
class ErrorResponse{
    constructor(
        statusCode,
        message = "Something went Wrong",
        errors = [],
        stack = ""
    ){
     
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        if (stack) {
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ErrorResponse}
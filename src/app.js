import express from "express"
import cors from "cors"
import { ORIGIN } from "./config/env.js"
import errorMiddleware from "./middleware/error.middleware.js"
import healthCheckRouter from "./routes/healthcheck.route.js"
import userRouter from "./routes/user.router.js"

const app = express()

app.use(cors({origin:ORIGIN,credentials:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))


app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/user",userRouter)

app.use(errorMiddleware)

export default app;
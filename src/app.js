import express from "express"
import cors from "cors"
import { ORIGIN } from "./config/env.js"
import errorMiddleware from "./middleware/error.middleware.js"
import healthCheckRouter from "./routes/healthcheck.route.js"

const app = express()

app.use(cors({origin:ORIGIN,credentials:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))


app.use("/api/v1/healthcheck",healthCheckRouter)

app.use(errorMiddleware)

export default app;
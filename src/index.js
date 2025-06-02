import app from "./app.js";
import {PORT} from "./config/env.js"
import connectDB from "./db/mongodb.js";



connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`APP RUNNING ON PORT : ${PORT}`)
    })
})
.catch((e)=>{
    console.log(e)
})
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
    app.on("error", (error) => {
        console.log("ERROR", error)
        throw error
    })
})
.catch((err) => {
    console.log("Mongodb Connection failed !!")
})


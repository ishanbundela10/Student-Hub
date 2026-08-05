import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// routers
import userRouter from "./routes/user.routes.js"
import propertyRouter from "./routes/property.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import visitRouter from "./routes/visit.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb" 
}))
app.use(express.urlencoded({
    extended:true, limit: "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("hello it is a server of student helper")
})

app.get("/hello", (req, res) => {
    res.send("HELLO WORKING");
});

// route declaration

app.use("/api/v1/users", userRouter)
app.use('/api/v1/properties', propertyRouter)
app.use('/api/v1/dashboard', dashboardRouter )
app.use("/api/v1/visits", visitRouter)
app.use("/api/v1/bookings", bookingRouter);


export {app}
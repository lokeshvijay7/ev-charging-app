import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import stationRoutes from "./routes/stations.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/stations", stationRoutes)

// Health check route
app.get("/", (req, res) => {
  res.send("EV Charging Station API is running")
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

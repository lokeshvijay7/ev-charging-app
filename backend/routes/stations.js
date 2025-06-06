import express from "express"
import ChargingStation from "../models/ChargingStation.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get all charging stations
router.get("/", async (req, res) => {
  try {
    const { status, connectorType, minPower, maxPower } = req.query

    // Build filter object
    const filter = {}

    if (status) filter.status = status
    if (connectorType) filter.connectorType = connectorType
    if (minPower) filter.powerOutput = { $gte: Number(minPower) }
    if (maxPower) {
      filter.powerOutput = { ...filter.powerOutput, $lte: Number(maxPower) }
    }

    const stations = await ChargingStation.find(filter).sort({ createdAt: -1 })
    res.json(stations)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get charging station by ID
router.get("/:id", async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id)

    if (!station) {
      return res.status(404).json({ message: "Charging station not found" })
    }

    res.json(station)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create a new charging station
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, coordinates, address, status, powerOutput, connectorType, amenities, pricing } = req.body

    const newStation = new ChargingStation({
      name,
      location: {
        coordinates,
        address,
      },
      status,
      powerOutput,
      connectorType,
      amenities,
      pricing,
      createdBy: req.user._id,
    })

    const savedStation = await newStation.save()
    res.status(201).json(savedStation)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update a charging station
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, coordinates, address, status, powerOutput, connectorType, amenities, pricing } = req.body

    // Find station and check ownership
    const station = await ChargingStation.findById(req.params.id)

    if (!station) {
      return res.status(404).json({ message: "Charging station not found" })
    }

    // Only allow creator or admin to update
    if (station.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this station" })
    }

    // Update fields
    const updatedStation = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      {
        name,
        "location.coordinates": coordinates,
        "location.address": address,
        status,
        powerOutput,
        connectorType,
        amenities,
        pricing,
      },
      { new: true },
    )

    res.json(updatedStation)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete a charging station
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find station and check ownership
    const station = await ChargingStation.findById(req.params.id)

    if (!station) {
      return res.status(404).json({ message: "Charging station not found" })
    }

    // Only allow creator or admin to delete
    if (station.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this station" })
    }

    await ChargingStation.findByIdAndDelete(req.params.id)
    res.json({ message: "Charging station deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get stations near a location
router.get("/near/:lat/:lng/:distance", async (req, res) => {
  try {
    const { lat, lng, distance } = req.params // distance in kilometers

    const stations = await ChargingStation.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(lng), Number.parseFloat(lat)],
          },
          $maxDistance: Number.parseFloat(distance) * 1000, // convert to meters
        },
      },
    })

    res.json(stations)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

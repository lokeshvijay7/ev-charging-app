import mongoose from "mongoose"

// ✅ Step 1: Create proper sub-schema for `location`
const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Avoid creating a subdocument ID
)

// ✅ Step 2: Main schema
const chargingStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: locationSchema, // ✅ Use schema object here directly
    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
      default: "Active",
    },
    powerOutput: {
      type: Number,
      required: true,
    },
    connectorType: {
      type: String,
      enum: ["Type 1", "Type 2", "CHAdeMO", "CCS", "Tesla"],
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    pricing: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// ✅ Step 3: Add geospatial index
chargingStationSchema.index({ location: "2dsphere" })

// ✅ Step 4: Export model
const ChargingStation = mongoose.model("ChargingStation", chargingStationSchema)

export default ChargingStation

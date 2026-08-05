import mongoose from "mongoose";
import dotenv from "dotenv";
import { Property } from "../src/models/property.model.js";

dotenv.config();

const ownerId = new mongoose.Types.ObjectId(
    "6a554c3d241861dea01b4b5c"
);

const properties = [
    // add data
    
];

await mongoose.connect(process.env.MONGODB_URI);

console.log("MongoDB Connected");

await Property.insertMany(properties);

console.log("Properties Seeded Successfully");

await mongoose.disconnect();

console.log("Done");
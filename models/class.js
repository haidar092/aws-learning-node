import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  teacher: { type: String, required: true },
});

export default mongoose.model("Class", classSchema);

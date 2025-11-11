import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
});

export default mongoose.model("Student", studentSchema);

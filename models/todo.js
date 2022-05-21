const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Todo", "Doing", "Done"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

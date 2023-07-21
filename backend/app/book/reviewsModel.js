const mongoose = require("mongoose");
const reviewsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
    },
  },

  {
    timestamps: true,
  }
);
module.exports = mongoose.model("reviews", reviewsSchema);

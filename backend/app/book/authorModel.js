const mongoose = require("mongoose");
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    birthDate: {
      type: Date,
    },

    biography: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("author", authorSchema);

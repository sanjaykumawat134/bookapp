const mongoose = require("mongoose");
const genresSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("geners", genresSchema);

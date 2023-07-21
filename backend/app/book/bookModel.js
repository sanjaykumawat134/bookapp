const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    publicationYear: {
      type: String,
    },

    ISBN: {
      type: String,
    },

    description: {
      type: String,
    },

    coverImageURL: {
      type: String,
      default: false,
    },

    authors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
      },
    ], // An array of ObjectIds referencing the authors collection
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "geners",
      },
    ],

    stateId: {
      type: Number,
      enum: [1, 2, 3], //1=> ACTIVE 2 => INACTIVE 3 =>DELETE
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("book", bookSchema);

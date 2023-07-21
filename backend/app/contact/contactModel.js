const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    email: {
      type: String,
    },

    dob: {
      type: String,
    },

    isSameAddress: {
      type: Boolean,
      default: false,
    },

    rstreet1: {
      type: String,
    },
    rstreet2: {
      type: String,
    },

    pstreet1: {
      type: String,
    },
    pstreet2: {
      type: String,
    },

    uploadedDocuments: [
      {
        name: {
          type: String,
        },
        type: {
          type: String,
          enum: ["image", "pdf"],
        },
        url: {
          type: String,
        },
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
module.exports = mongoose.model("contact", contactSchema);

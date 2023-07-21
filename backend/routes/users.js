var express = require("express");
var router = express.Router();
const CONTACT_CONTROLLER = require("../app/contact/contact.controller");
const CONTACT = require("../app/contact/contactModel");
const AUTH_CONTROLLER = require("../app/auth/auth.controller/authController");

/* GET users listing. */

const fs = require("fs");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    console.log("rreq", req.email);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "application/pdf" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg .pdf format allowed!"));
    }
  },
});

// router.post(
//   "/add",
//   [
//     uploadStorage.any("uploadFiles"),
//     body("first_name").notEmpty().withMessage("first_name is required"),
//     body("last_name").notEmpty().withMessage("last_name is required"),
//     body("email").notEmpty().withMessage("Email is required"),
//     // .isEmail()
//     // .withMessage("Invalid email"),
//     body("dob")
//       .notEmpty()
//       .withMessage("dob is required")
//       .custom((value) => {
//         const currentDate = new Date();
//         const inputDate = new Date(value);
//         const eighteenYearsAgo = new Date().setFullYear(
//           currentDate.getFullYear() - 18
//         );

//         if (inputDate > eighteenYearsAgo) {
//           throw new Error("dob must be greater than 18");
//         }

//         return true;
//       })
//       .toDate(),

//     body("residential_street1")
//       .notEmpty()
//       .withMessage("residential_street1 is required"),
//     body("residential_street2")
//       .notEmpty()
//       .withMessage("residential_street2 is required"),
//     body("is_same_address")
//       .notEmpty()
//       .withMessage("is_same_address is required")
//       .custom((isSameaddress, { req }) => {
//         if (isSameaddress == "true") {
//           req.body["pstreet1"] = req.body.rstreet1;
//           req.body["pstreet2"] = req.body.rstreet2;
//         } else {
//           console.log("isSameaddress else", isSameaddress);
//           throw new Error(
//             "permanent_street1 and permanent_street2 is required"
//           );
//         }
//         return true;
//       }),
//     body("upload_documents")
//       .notEmpty()
//       .withMessage("upload_documents is required"),
//   ],
//   CONTACT_CONTROLLER.addContact
// );

// router.post("/add-new", async (req, res, next) => {
//   let dataToSave = req.body.first_name;
//   let record = await new CONTACT({ first_name: dataToSave });
//   console.log("Res", record);
//   res.send({ record });
// });

// router.get("/all", CONTACT_CONTROLLER.getAllContacts);

// routes for user module
router.post("/signup", AUTH_CONTROLLER.signup);
router.post("/login", AUTH_CONTROLLER.login);

module.exports = router;

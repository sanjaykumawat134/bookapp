const { validationResult } = require("express-validator");
const CONTACT = require("./contactModel");
const fs = require("fs");
const _contact = {};
_contact.addContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log("req.files", req.files);
    if (!errors.isEmpty()) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Error deleting file ${file.path}`);
          }
        });
      });
      return res.status(400).json({
        errors: errors.array().map((error) => {
          return { message: error.msg };
        }),
      });
    }
    // some extra validation for exact match for file types;
    if (JSON.parse(req.body.upload_documents).length !== req.files.length) {
      // some type and name are missing
      // delete uploaded files
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error(`Error deleting file ${file.path}`);
          }
        });
      });
      return res.status(400).json({
        errors: "One of attribute missing either file , filetype or name",
      });
    }

    let contactToBeSave = {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      dob: req.body.dob,
      isSameAddress: req.body.is_same_address,
      rstreet1: req.body.residential_street1,
      rstreet2: req.body.residential_street2,
      pstreet1: req.body.is_same_address
        ? req.body.residential_street1
        : req.body.permanent_street1,
      pstreet2: req.body.is_same_address
        ? req.body.residential_street2
        : req.body.permanent_street2,
      uploadedDocuments: JSON.parse(req.body.upload_documents).map(
        (item, ind) => {
          return {
            ...item,
            url: req.files[ind].filename,
          };
        }
      ),
    };

    let savedContact = await new CONTACT(contactToBeSave).save();
    return res.status(201).json({
      message: "Contact saved successfully",
      data: savedContact,
    });
  } catch (error) {
    console.log("error", error);
  }
};

_contact.getAllContacts = async (req, res, next) => {
  let contacts = await CONTACT.find({});
  res.send({ contacts });
};

module.exports = _contact;

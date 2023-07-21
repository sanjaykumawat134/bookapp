
const express = require("express")
const multer = require("multer")
const fs = require('fs')
const Contact = require('../model/user.model')


const dir = "./uploads/files"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dir)
    },
    filename: (req, file, cb) => {

        console.log("rreq",req.body)
      cb(null, Date.now() + "-" + file.originalname)

    },
  })
  var isInvalidFile;

  const uploadStorage = multer({ storage: storage ,
    fileFilter: (req, file, cb) => {
        console.log('file.mimetype',file.mimetype);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "application/pdf" || file.mimetype == "image/jpeg") {
          cb(null, true);
           isInvalidFile = 0;
        } else {
             isInvalidFile = 1; 

          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg .pdf format allowed!'));
        }
      }
}).any('uploadFiles');


const _contact ={}
 

_contact.addContact = async(req,res,next)=>{
    try {


        if(!fs.existsSync(dir)){
            fs.mkdir(dir,(err) => { 
                if (err) { 
                  console.log(err); 
                } 
              })
        }

        let filesToSave =[]
        uploadStorage(req, res, async function(err) {

            req.body.createdBy = req.userId

            if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.dob || !req.body.residentialAddress) {
                res.status(400).send({
                    success:false,
                    messages:"All Field is mandatory"
                })
                return
            }           
            if(req.files.length>1 && isInvalidFile == 0)
            {
      
           
             req.files.forEach((file ,ind )=> {
             
                filesToSave.push({
               //     ...file, 
                    name:JSON.parse(req.body.fileNames)[ind],
                    type:JSON.parse(req.body.fileTypes)[ind],
                    url:file.path,
                })
             });

             let curruntDate = new Date()
            let ageDiff = curruntDate.getFullYear() - new Date(req.body.dob).getFullYear()
             if (ageDiff < 18) {
                res.status(400).send({
                    success: false,
                    message:'Minimum age should be more than 18 years'
                })
                return 
                
             }

             if(!req.body.isSameAddress){
     
                 // need to force user to add residedntial Address
             
             
             req.body.residentialAddress =JSON.parse( req.body.residentialAddress);
            req.body.permanentAddress =JSON.parse( req.body.permanentAddress);
               let payloadObj = {
                   ...req.body,
                   files :filesToSave
               }
               // save the record
               let savedRecord = await Contact(payloadObj).save()
               if(savedRecord){

                   res.status(200).send({
                     success:true,
                     message:'Successfully added',
                     data:savedRecord
                   })
               }
               else{
                res.status(400).send({
                    success:false,
                    message:'Custom fail',
                  })
               }
            
             }else{

                  req.body.residentialAddress =JSON.parse(req.body.residentialAddress);
                  req.body.permanentAddress =req.body.residentialAddress;

                 console.log('req.body',req.body);
                 let payloadObj = {
                     ...req.body,
                     files:filesToSave,
                 
                 }
                 console.log('payloadObj',payloadObj);
                 // save the record
                 let savedRecord = await Contact(payloadObj).save()
                 res.status(200).send({
                    success:true,
                    message:'Successfully added',
                    data:savedRecord
                  })
                  return
             }
            }
            else if(isInvalidFile == 1){
                res.status(400).send({
                    success:false,
                    message:'Only .png, .jpg and .jpeg .pdf format allowed!',
                  })
            }
            else{
                res.status(400).send({
                    success:false,
                    message:'Minimum two documents are required',
                  })
            }
        })
      

    } catch (error) {
        console.log('error============>',error);
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}
module.exports = _contact

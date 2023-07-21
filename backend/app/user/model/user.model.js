/*
Author (Rajat chauhan)

emailId : rajatchauhan527@gmail.com

*/

const mongoose = require('mongoose')
const contactSchema = new mongoose.Schema({

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

    isSameAddress:{
        type:Boolean,
        default:false
    },


    residentialAddress: {
        
        street1:{
            type: String,
        },
        street2:{
            type: String
        },
    },

    permanentAddress: {
        
        street1:{
            type: String,
        
        },
        street2:{
            type: String,
           
        },
    },

    files:[{
        name:  {
              type:String,
              
          },
          type:  {
            type:String,
            
            enum:['image','pdf']
        },
        url:  {
            type:String,
            
        }
    }
    ]
    ,
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'auth'
    },

    stateId: {
        type: Number,
        enum : [1,2,3], //1=> ACTIVE 2 => INACTIVE 3 =>DELETE 
        default: 1
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model('contact', contactSchema)

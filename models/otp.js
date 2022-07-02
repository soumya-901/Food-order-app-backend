const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    expirein:String
   },
   {
    timestamps:true

})
const otp = mongoose.model("OTP",otpSchema);
module.exports=otp;
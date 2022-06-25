const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email:{
        required:true,
        type:String
    },
    phone: {
        required: true,
        type: String
    },
    address:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    
    // tokens:[
    //     {
    //         token:{
    //             required:true,
    
    //             type:String
    //         }
    //     }
    // ]

})
dataSchema.pre('save', async function(next){
    if (this.isModified('password')) {
        console.log("hello")
        this.password= await bcrypt.hash(this.password,12);
        // this.password=bcrypt.hash(this.password,12);
    }
    next();
});

// generating token
dataSchema.methods.generateAuthToken = async function(id) {
    try {
        let token = jwt.sign({user_id:id} ,process.env.SECRET_KEY , {expiresIn:"1d"});
        // this.tokens=this.tokens.concat({token:token});
//         await this.save();   
        return token;
    } catch (error) {
        console.log(error);
    }
    
}


const User =  mongoose.model('USER', dataSchema);
module.exports=User;
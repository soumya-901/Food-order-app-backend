const mongoose = require('mongoose');
require('dotenv').config();

const itemSchema = new mongoose.Schema({
    itemname:  {type:String,required:true},
    filename:  { type: String, required: true },
    path:      { type: String, required: true },
    url:       {type:String,required:false },
    size:      { type: Number, required: true },
    uuid:      { type: String, required: true },
    price:     { type:Number,  required:true },
    discount:  {type:Number,required:true},
    timetomake:{type:Number,required:true}
}, { timestamps: true 
})

itemSchema.pre('save', async function(next){
        if (this.isModified('uuid')) {
            console.log("hello")
            this.url = `${process.env.APP_BASE_URL}/api/${this.uuid}`;
            // this.password=bcrypt.hash(this.password,12);
        }
        next();
    });

const Data =  mongoose.model('ITEM', itemSchema);
module.exports=Data;
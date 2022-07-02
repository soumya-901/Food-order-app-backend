const bcrypt = require('bcryptjs');
const Model = require('../models/model');
const Otp = require('../models/otp')
const nodemailer = require('nodemailer');
require('dotenv').config();

const mailer = async (req,res)=>{
    const userExist = await Model.find({email:req.body.email});
    if(userExist){
        const otpcode= Math.floor((Math.random()*10000)+1);
        console.log(otpcode);
        const otp = new Otp({
            email:req.body.email,
            code:otpcode,
            expirein: new Date().getTime()+ 300*1000
        })
        // console.log(otp);
        const OTP = await otp.save();
        sendmail(OTP.email,OTP.code);
        res.json({success:"we are sent a 6 digit code to your mail ,please check your mail"});
    }
    else{
        res.json({error:"we didn't find any account link with this email"});
    }
}
const sendmail=(email,otp)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        requireTLS:true,
        auth: {
            user: 'lipuparhi008@gmail.com',
            pass: 'ykbwzjnqcwxqdlai'
        }
    });
    
    const mailOptions = {
        from: 'lipuparhi008@gmail.com',
        to: `${email}`,
        subject: 'Food Co',
        text: `<p>Your otp is - ${otp} , it only valid for 5 minitues</p>`,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error.message);
        }
        console.log('Email Sent: '+ info);
    });
}
const changepwd = async(req,res)=>{
    const {email,otp,password}=req.body;
    const data = await Otp.find({email:email ,code:otp});
    if(data)
    {
        console.log(data);
        const currenttime = new Date().getTime();
        const difference = (data[0].expirein *1)- (currenttime*1)  ;
        if(difference>0){
            const userExist = await Model.find({email:email});
            console.log(userExist[0]._id)
            const newpwd2 = await bcrypt.hash(password,12);
            Model.findByIdAndUpdate(userExist[0]._id,{password:newpwd2},{
                new:true
            })
            .then(data=>{
                console.log(data);
                res.json({success:"passord changes successfully , please login with your new password"});
            })
            .catch(err=>{
                res.json(err);
            })
        }
        else{
            res.json({error:"otp expire , please go back and sent otp again"});
        }
    }
    else{
        res.json({error:"invalid otp"});
    }
}
module.exports={
    mailer,
    changepwd
}
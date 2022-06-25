const bcrypt = require('bcryptjs');
const express = require('express');
const Model = require('../models/model');
const Item = require('../models/item')
const jwt = require('jsonwebtoken')
const router = express.Router()
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();


//Post Method

router.post('/post', async (req, res) => {
    
    try {
        const userExist = await Model.findOne({name:req.body.name})
        if(userExist)
        {
            return res.status(422).json({error:"user name is already exit"});
        }
        const data = new Model({
            name: req.body.name,
            email:req.body.email,
            phone: req.body.phone,
            address:req.body.address,
            password:req.body.password
        })
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})
router.post('/post/item', async (req, res) => {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/') ,
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            cb(null, uniqueName)
        } ,
    });
    let imageupload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('filename');
    try {
        imageupload(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ error: err.message });
            }
            const data = new Item({
                itemname:req.body.itemname,
                filename: req.file.filename,
                uuid: uuidv4(),
                path: req.file.path,
                size: req.file.size,
                price:req.body.price,
                discount:req.body.discount,
                timetomake:req.body.timetomake
            })
        const dataToSave = await data.save();
        // res.status(200).json(dataToSave)
        // res.status(200).json({ file: `${process.env.APP_BASE_URL}/api/${dataToSave.uuid}` });
        return res.status(200).json(dataToSave);
        });
    }
    catch (error) {
        console.log(error.message)
        res.status(400).json({message: error.message})
    }
})
router.get('/:uuid',async (req, res) => {
    const file = await Item.findOne({ uuid: req.params.uuid});
    // Link expired
    if(!file) {
        return res.status(410).json({ error: 'Link has been expired.'});
    } 
//     const response = await file.save();
    const filePath = `${__dirname}/../${file.path}`;
    res.render(filePath);
});

router.post('/signin', async (req, res) => {
    const {name,password}=req.body;
    try {
        const userExist = await Model.findOne({name:name})
        if(userExist)
        {
            // console.log(userExist.password)
            const ismatch= await bcrypt.compare(password,userExist.password);
            // console.log(userExist.password)
            const Password = userExist.password;
            if (ismatch) {
            //     const token = await userExist.generateAuthToken();
            //     console.log(token)
            //     res.cookie("jwt_web_token",token,{
            //         expires:new Date(Date.now()+258920000),
            //         httpOnly:true
            //     })
                // console.log(ismatch)
               res.json({message:"success"})
            } 
            else {
                res.json({error:"password did'nt match"});
            }
        }
        else{
            res.json({user:"invalid user"});
        }
    } 
    catch (error) {
        res.status(400).json({message: error.message})
    }
})
router.patch('/changepwd/:id', async (req, res) => {
    const {oldpwd,newpwd}=req.body;
    try {
        const _id = req.params.id;
        console.log(_id)
        const userExist = await Model.findById(_id);
        console.log(userExist)
        const ismatch= await bcrypt.compare(oldpwd,userExist.password);
        if (ismatch) {
            console.log(ismatch);
            const newpwd2 = await bcrypt.hash(newpwd,12);
            Model.findByIdAndUpdate(_id,{password:newpwd2},{
                new:true
            })
            .then(result =>{
                console.log(result)
                // res.status(200).send(result)
                 res.status(200).json({result: "password changes successfully"})
                
            })
            .catch(err=>{
                res.json("error is",err)
            })
        } else {
            res.json({error:"password did'nt match"});
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Get all Method
router.get('/getall/user', async(req, res) => {
    const allData= await Model.find()
    // console.log(allData)
    res.send(allData)
})
router.get('/getAll/item', async(req, res) => {
    const allData= await Item.find()
    res.send(allData)
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    const allData3= await Model.findById(req.params.id);
    res.send(allData3);
})
router.get('/search/:itemname',async(req,res)=>{
    let ragex = new RegExp(req.params.itemname , "i");
    const searchdata= await Item.find({itemname:ragex});
    res.status(200).json(searchdata);
    
})
//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})


module.exports = router;
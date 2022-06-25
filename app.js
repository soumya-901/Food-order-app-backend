const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const routes = require('./routes/routes');
const Model = require('./models/model');
require('dotenv').config();

const app = express();
const port =process.env.PORT || 4000;
const DB =process.env.DB_LOCAL;
const DBITEM= process.env.DB_ATLAS;
app.use(express.json());

mongoose.connect(DBITEM,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("data base connect successfully")
})
.catch((err)=>{
    console.log(err)
})
// mongoose.createConnection(DBITEM,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// })
// .then(()=>{
//     console.log("data base item connect successfully")
// })
// .catch((err)=>{
//     console.log(err)
// })
app.get('/',verifyToken,async (req ,res)=>{
    // console.log(req.name);
    const userExist = await Model.findOne({_id:req.name.user_id})
    // console.log(userExist);
    res.send('api work properly , kindly use proper route to get the content');
})
app.use('/api', routes);
app.use(express.json());

function verifyToken (req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token)
    {
        return res.json({"token":"Please login to get Access_token"})
    }  
    jwt.verify(token,process.env.SECRET_KEY,(err,user_id)=>{
        if(err)
        {
            return res.redirect('/api/signin');
        }
        else{
            req.name = user_id;
            // console.log(user_id)
            next();
        }
    })

}

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})
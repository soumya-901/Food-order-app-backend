const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
require('dotenv').config();

const app = express();
const port =process.env.PORT;
const DB =process.env.DB_LOCAL;
const DBITEM= process.env.DB_LOCAL2;
app.use(express.json());

mongoose.connect(DB,{
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
app.use('/api', routes)
app.use(express.json());

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})
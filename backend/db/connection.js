const mongoose=require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.mongodb_URL).then(()=>{
    console.log('connection established')
})
.catch(()=>{
    console.log('connection error')
})
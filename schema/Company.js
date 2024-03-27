const mongoose=require('mongoose')
const company=new mongoose.Schema({
    name:{
        type:String,
    },
    address:{
        type:String,
    },
    products:[{
        mobile:[{
            type:String
        }],
        laptop:[{
            type:String
        }],
    }]
})
module.exports=mongoose.model('Company',company)
const mongoose=require('mongoose')
const validator=require('../validator')
const company=new mongoose.Schema({
    name:{
        type:String,
        validate: {
            validator: validator.validateCName,
            message: 'Invalid name. Name should only contain alphabets.',
          },
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
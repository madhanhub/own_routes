const mongoose = require('mongoose')
const validator=require('../validator')
const user_schema =new mongoose.Schema({
    
    user_name:{
        type:String,
        validate: {
            validator: validator.validateName,
            message: ' Invalid user name.',
          },
    },
    image:{
        type:String

    },
    statu:{
            type:Boolean,
            default:false
    },
    email:{
        type:String,
        validate: {
        validator: validator.validateEmail,
        message: 'Invalid email.',
      },
        
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    labels:[{
        label:{
        type:String,
    },
    title:{
        type:String,
        },
    iscomplete:{
        type:String,
        default:false,//user
},
}],

// title:[{
//     type:String
// }],
    password:{
        type:String
    },
    products:[{
        type:String,
        
    }]
})
module.exports =mongoose.model("User",user_schema)
const mongoose = require('mongoose')
const user_schema =new mongoose.Schema({
    
    user_name:{
        type:String
    },
    image:{
        type:String

    },
    statu:{
            type:Boolean,
            default:false
    },
    email:{
        type:String
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
        default:"empty" 
    }]
})
module.exports =mongoose.model("User",user_schema)
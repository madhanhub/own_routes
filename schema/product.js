const mongoose = require('mongoose')
const product =new mongoose.Schema({
    
    name:{
        type:String
    },
    statu:{
        type:Boolean,
        default:false
    },

    product:[{
        phone:{
            phone_name:{type:String},
            phone_type:{type:String},
            phone_price:{type:Number},
            
        },
        laptop:{
            laptop_name:{type:String},
            laptop_type:{type:String},
            laptop_price:{type:Number},
            
        }
        
        //  avaliable:{
        //     type:String,
        //     default:true
        // }
             
}],
        
    
})
module.exports =mongoose.model("product",product)
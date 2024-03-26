const mongoose=require('mongoose')
const total_sales=new mongoose.Schema({
    sales_count:{
        type:Number,
    },
    phone_sales:[{
        
        phone_name:String,
        phone_amount:Number,
        
    }],
    status:{
        type:Boolean,
        default:true
    }
    
})
module.exports=mongoose.model('Sales',total_sales)
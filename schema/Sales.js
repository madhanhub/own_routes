const mongoose=require('mongoose')
const total_sales=new mongoose.Schema({
    sales_count:{
        type:Number,
    },
    phone_sales:[{
        
        phone_name:String,
        phone_amount:Number,
        phone_buy:{
            type:Boolean,
        default:false},
    }],
    status:{
        type:Boolean,
        default:false
    },
    laptop:[{
        laptop_name:String,
        laptop_buy:
        {   
        type:Boolean,
        default:true}
        
    }],
    
})
module.exports=mongoose.model('Sales',total_sales)
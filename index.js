const express = require('express')
const app=express()
const morgan=require('morgan')
const mongoose= require('mongoose')
const path= require('path')
const axios=require('axios')
const dotenv=require('dotenv').config()
// dotenv.config()


const multer=require('multer')
// const storage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'photo')
//   },
//   filename:(req,file,cb)=>{
//   cb(null,file.originalname)
//     }
// })
// const photo=multer({storage})
// app.set('viewengine','ejs')
const jsonwebtoken=require('jsonwebtoken')
const user=require('./schema/User')
const product = require('./schema/product')
const company=require('./schema/Company')
const sales=require('./schema/Sales')
const authorization = require('./function/auth')
const cors= require('./function/cors')
const upload= require('./function/upload_images')
const { title } = require('process')
app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(cors)

app.listen(1111, () => {
	console.log('SERVER Run')

	mongoose.set('strictQuery', false)
	//connecting mongodb
	mongoose
		.connect(`mongodb+srv://madhan91101:Mcabca%409@klncollege.ab2hmvj.mongodb.net/`
			//process.env.MYDB_CONNECTION,
		// 	, {
		// 	useNewUrlParser: true,
		// 	useUnifiedTopology: true,
)
		.then(() => {
			conn = mongoose.connection
			console.log('database Connected')
		})
		.catch((error) => {
			console.log('Error connecting to MongoDB:', error)
		})
})


app.get('/', async (req, res) => {
	res.json('welcome ')
})
//axios
app.post('/user/add', async(req,res)=>{
  try{
      const { email, mobile,user_name} = req.body

      new user({email,mobile,user_name}).save();

      const response=await axios.post(`http://192.168.29.4:3333/appadd`,{
          mobile,
          email,
          user_name,
      })
      
      res.status(200).json({
    success: true,
    message: 'success',
    data:   response.data,
  })
  }
  catch(error) {
          console.error(error)
          res.status(500).json({ success: false, message: error.message, error })
  }
})

// app.post('/user/delete',async(req,res)=>{
//   try{
//     const {email,user_name}=req.body;
    
//     const remove=await axios.post(`http://192.168.29.4:3333/appdelete`,
//     {
//       method:'delete',
//      user_name,
//      email
     
//     })
//     res.status(200).json({message:"success",data:remove.data})
//   }catch(error){
//     res.status(500).json({message:"failed"})
//   }
// })



app.post('/useradd', async(req,res)=>{
    try{
        const { label,products,email, mobile, password,user_name,address } = req.body

        const add=new user({
            user_name,
            mobile,
            email,
            address,
            password,
            products,
            label
        })
        await add.save()
        res.status(200).json({
			success: true,
			message: 'success',
			data:   add,
		})
    }
    catch(error) {
            console.error(error)
            res.status(500).json({ success: false, message: error.message, error })
    }
})

app.post('/user/create',authorization,async(req,res)=>{
  const token= req.header.authorization
  console.log(token)
  try{
    const create=await user({
      id:req.body,
      user_name:req.body.user_name,
      email:req.body.email,
      mobile:req.body.mobile,
      address:req.body.address,
      labels:req.body.labels,
      password:req.body.password
    }).save()
    res.status(200).json({message:"success",data:create})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})


app.post('/user/login',async(req,res)=>{
  try{
    const {email,password}= req.body

    const user_login=await user.findOne({
      email,
      password,
      
    })
    
    
  if(user_login){
    {
      let token= await jsonwebtoken.sign({id:user_login.id,user_name:user_login.user_name,email:user_login.email},process.env.SECRET)
      res.setHeader('token',token)
      res.setHeader('user_name',user_login.user_name)
      res.setHeader('email', user_login.email)
      
      res.status(200).json({message:"success",data:token})
    }

  }else{
			res.status(400).json({ success: false, message: 'email or password invalid ' })
		
  }
  } catch (error) {
		res.status(500).json({ success: false, message: error.message, error })
		console.log(error)
	}
})


app.post('/user/list',authorization,async(req,res)=>{
  try{
    const title=await user.findOne({
      _id:req.id},{labels:0})
    res.status(200).json({message:"success",data:title})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})

app.post('/user/delete',authorization,async(req,res)=>{
  try{
    const del=await user.findOneAndDelete({
      id:req.body.id
    })
    res.status(200).json({message:"success",data:del})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})

//user_title
app.post('/user/title',authorization,async(req,res)=>{
  
  try{
    const user_title=await user.findOneAndUpdate({
      _id:req.id},
      {$push:{title:req.body.title}
    },
    {new:true}
    )
  
    res.status(200).json({message:"success",data:user_title})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})

//user_labels_add
app.post('/user/labels',authorization,async(req,res)=>{
  try{
    const labels=await user.findOneAndUpdate({
      _id:req.id},
      {$push:{labels:{label:req.body.label,title:req.body.title}}
    },
    )
    res.status(200).json({message:"success",data:labels})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})


app.post('/userfind',async(req,res)=>{
  try{
    const find=await user.findOneAndUpdate({

      name:req.body.name},{$set:{statu:true}})

      var user_name=find.name

      await product.findOneAndUpdate({

        user_name:user_name},{$set:{statu:true}})

      res.status(200).json({message:"success",data:find})
      
  }catch(error){
        res.status(500).json({message:"failed"})
  }

})

//user_change_iscomplete
app.post('/user/change',authorization,async(req,res)=>{
  try{
      const change=await user.findOneAndUpdate({_id:req.body.id,'labels.title':req.body.title},
        {$set:{'labels.$.iscomplete':true}})
        
        res.status(200).json({message:"success",data:change})
  }catch(error){
    res.status(200).json({message:"failed"})
  }
})

//user_change_status
app.post('/user/statu',authorization,async(req,res)=>{
  try{
    const statu=await user.findOneAndUpdate(
      {user_name:req.user_name,statu:false},
      {$set:{statu:true}},
      {new:true}
    )
      res.status(200).json({message:"success",data:statu})

  }catch(error){
    res.status(500).json({success:false,message:"failed"})
  }
})


app.post('/userfilter',async(req,res)=>{
  try{
    const filter= await user.findOne({name:req.body.name,statu:true})
    var user_name=filter.name
    await product.findOneAndUpdate({
    user_name:user_name},{$set:{statu:false}}
      
    )
    res.status(200).json({message:"success",data:filter})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})

// app.post('/userfind', async (req, res) => {
//   try {
//     // Ensure "user" and "product" models are properly imported or defined above this route.
//     // Assuming "user" and "product" are your Mongoose model variables.

//     // Updating user status
//     const updatedUser = await user.findOneAndUpdate(
//       { name: req.body.user_name }, 
//       { $set: { status: true } }, // Assuming the correct field name is "status"
//       { new: true } // Return the updated document instead of the original
//     )
      

//     const updatedProduct = await product.findOneAndUpdate(
//       { user_name: req.body.user_name }, // Use the name from the updated user document
//       { $set: { status: true } }, // Assuming the correct field name is "status"
//       { new: true }
//     );
//       console.log(updatedProduct)
//       //console.log(updatedProduct)

   
//     // Responding with the updated user data
//     // Optionally, you can include updated product data in the response if needed
//     res.status(200).json({ message: "Success", data: updatedUser });
    
//   } catch (error) {
//     console.error(error); // Logging the error can help in debugging
//     res.status(500).json({ message: "Failed", error: error.message });
//   }
// });

app.post('/userreplace',async(req,res)=>{
 var name="ken"
  try{
  const findone=await user.findOneAndUpdate({
    user_name:name},{$set:{statu:true}})

    

  res.status(200).json({message:"success",data:findone})
}
catch(error){

  res.status(500).json({message:"failed"})

}
})

app.post('/product',async(req,res)=>{
  try{
    const{name}=req.body
    const pro=new product({
      name:req.body.name,
      
      
    }) 
    pro.save()
  res.status(200).json({message:"success",data:pro})
  }catch(error){
    res.status(500).json({message:'failed'})
  }
})

app.post('/product/phone',async(req,res)=>{
  try{
    const pro=await product.findOneAndUpdate({name:req.body.name},{$push:{'product.0.phone':{
      phone_type:req.body.phone_type,
      phone_name:req.body.phone_name,
      phone_price:req.body.phone_price,
      
      

    }}},{new:true})
    res.status(200).json({message:"success",data:pro})

  }catch(error){
    res.status(500).json({message:"failed"})
  }//index
})
      

app.post('/product/laptop',async(req,res)=>{
  try{
    const laptop=await product.findOneAndUpdate({name:req.body.name},{$push:{'product.0.laptop':{
      laptop_name:req.body.laptop_name,
      laptop_type:req.body.laptop_type,
      laptop_price:req.body.laptop_price
    }}})
    res.status(200).json({message:"success",data:laptop})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})

// app.post('/product/update',async(req,res)=>{
//   try{
//     const update=await product.findOneAndUpdate({user_name:req.body.user_name}
//       ,{'product.laptop.laptop_name':req.body.laptop_name}},
//       {$set:{'product.$[elem].laptop_price':req.body.laptop_price}},
//       {
//         arrayFilters:[{'elem.laptop_name':req.body.laptop_name}],
//         new:true
//       })
//   res.status(200).json({message:"success",data:update})
//     }catch(error){
//     res.status(500).json({message:"failed"})
//   }
// })

app.post('/product/update',async(req,res)=>{
  try{
    const update =await product.updateOne({_id:req.body._id,'product.laptop':{$elemMatch:{laptop_name:req.body.name}}},
      
      {$set:{'product.$[].laptop.$[elem].laptop_price':req.body.price}},
       {arrayFilters:[{'elem.laptop_name':req.body.name}],
       new:true}
      )

  res.status(200).json({message:"success",data:update})
    }catch(error){
    res.status(500).json({message:"failed"})
  }
})
// app.post('/updateName', async (req, res) => {
//     try {
//         const _id = req.body._id;
//         const laptop_name = req.body.laptop_name;

//         // Update the document
//         const cancelResult = await product.findOneAndUpdate(
//             {
//                 'product.laptop': {
//                     $elemMatch: {
//                         _id: new mongoose.Types.ObjectId(_id),
//                     },
//                 },
//             },
//             {
//                 $set: {
//                     'product.$[].laptop.$[item].laptop_name': laptop_name,
//                 },
//             },
//             {
//                 arrayFilters: [
//                     {
//                         'item._id': new mongoose.Types.ObjectId(_id),
//                     },
//                 ],
//                 new: true, // to return the updated document
//             }

//         );

//         // Check if document is found and updated
//        res.status(200).json({message:"success",data:cancelResult})
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });




app.post('/product/delete',async(req,res)=>{
try{
  const del=await product.findOneAndUpdate({_id:req.body._id},
    {$pull:{'product.0.laptop':{laptop_name:req.body.laptop_name}}}
  )
  res.status(200).json({message:"success",data:cancleResult})
}catch(error){
  res.status(500).json({message:"failed"})
}
})



app.post('/user/product',async(req,res)=>{
  try{

    const pro=await user.findOneAndUpdate({

      user_name:req.body.user_name
    },{$push:{product:req.body.products}})

    res.status(200).json({message:"success",data:pro})
  }catch(error){
    res.status(500).json({message:"failed"})
  }
})

app.post('/rout',async(req,res)=>{
  try{
    const out=await product.findOne({
      //id:req.body._id,
      email:req.body.email
    })
    res.status(200).json({message:"ok",data:out})
  }catch(error){
    res.status(500).json({message:"not ok"})
  }
})

// app.post('/product',async (req,res)=>{
//       try{
//           const user_name=await user.findOneAndUpdate({name:req.body.name}
//             ,{$set:{statu:true}})

//             console.log(user_name.name)
//             res.status(200).json({message:"success",data:user_name.name})
//       }
//       catch{
//         res.status(500).json({message:"failed"})

//       }
// })
// app.post('/pro',async (req,res)=>{
//   var name='kumar'
//   try{
//       const find=await product.findOneAndUpdate({user_name:name}
//         ,{$set:{statu:true}})

        
//         res.status(200).json({message:"success",data:find})
//   }
//   catch{
//     res.status(500).json({message:"failed"})

//   }
// })

// app.post('/upload',upload.single('file'),(req,res)=>{
// 	res.json('success')	
//   res.json(req.file)
// })

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully', fileInfo: req.file })
  res.json(req.file)
})


app.post('/sale',async(req,res)=>{
  try{
    const sales_list=await sales.insertMany({
      sales_count:req.body.sales_count
    }) 
      res.status(200).json({message:"success",data:sales_list})
  }catch(error){
    res.status(500).json({message:'failed'})
  }
})

app.post('/phone',async(req,res)=>{
  try{
    const sales_amount=await sales.findOneAndUpdate({_id:req.body._id},
      {$push:{phone_sales:{phone_name:req.body.phone_name,
      phone_amount:req.body.phone_amount}}}) 
      res.status(200).json({message:"success",data:sales_amount})
  }catch(error){
    res.status(500).json({message:'failed'})
  }
})

app.post('/status',async(req,res)=>{
  try{
    const sts=await sales.findOneAndUpdate({
      _id:req.body._id,status:true  
    },{$set:{status:false}}
    )
    res.status(200).json({message:'success',data:sts})
  }catch(error){
    res.status(500).json({message:'failed'})
  }
})

app.post('/laptop',async(req,res)=>{
  try{
    const lap=await sales.findOneAndUpdate({_id:req.body._id},
      {$push:{laptop:{laptop_name:req.body.laptop_name}}})
      res.status(200).json({message:"success",data:lap})    
  }catch(error){
  res.status(500).json({message:'failed'})  
  }
  
})

app.post('/laptop/sts',async(req,res)=>{
  try{
    const lap_sts=await sales.findOneAndUpdate({_id:req.body._id,'laptop.laptop_name':req.body.laptop_name},
      {$set:{'laptop.$.laptop_buy':true}},
      {new:true})
      res.status(200).json({message:"success",data:lap_sts})    
  }catch(error){
  res.status(500).json({message:'failed'})  
  }
  
})

app.post('/phone/sts',async(req,res)=>{
  try{
    const ph_sts=await sales.findOneAndUpdate({_id:req.body._id,'phone_sales.phone_name':req.body.phone_name},
      {$set:{'phone_sales.$.phone_buy':true}},
      {new:true})
      res.status(200).json({message:"success",data:ph_sts})    
  }catch(error){
  res.status(500).json({message:'failed'})  
  }
  
})

app.post('/name',async(req,res)=>{
  try{
    const{name,address,product}=req.body
    const c_name=new company({
      name,
      address,
      product
    }).save()
    res.status(200).json({message:"success",data:c_name})
  }catch(error){
    res.status(500).json({message:'failed'})
  }
})


app.post('/product/mobile',async(req,res)=>{
  try{
    const m_list=await company.findOneAndUpdate({
      _id:req.body._id
    },{$push:{"products.0.mobile":req.body.mobile,'products.0.laptop':req.body.laptop}},
    {new:true})
    res.status(200).json({message:'success',data:m_list})
  }catch(error){
    res.status(500).json({message:'failed'})
  }
})
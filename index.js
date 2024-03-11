const express = require('express')
const app=express()
const morgan=require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const dotenv=require('dotenv')
dotenv.config()
const jsonwebtoken=require('jsonwebtoken')

const user=require('./schema/User')
const product = require('./schema/product')
const authorization = require('./function/auth')
const { title } = require('process')
app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))

app.listen(2222, () => {
	console.log('SERVER Run ')

	mongoose.set('strictQuery', false)
	//connecting mongodb
	mongoose
		.connect(`mongodb+srv://madhan91101:Mcabca%409@klncollege.ab2hmvj.mongodb.net/`
			//process.env.MYDB_CONNECTION,
			, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
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

app.post('/user/login',async(req,res)=>{
  try{
    const {email,password}= req.body

    const user_login=await user.findOne({
      email,
      password,
      
    })
    
    
  if(user_login){
    {
      let token= await jsonwebtoken.sign({id:user_login.id,user_name:user_login.user_name,email:user_login.email,labels:user_login.labels},process.env.SECRET)
      res.setHeader('token',token)
      res.setHeader('user_name',user_login.user_name)
      res.setHeader('email', user_login.email)
      res.setHeader('labels',user_login.labels)
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

app.post('/user/list',authorization,async(req,res)=>{
  try{
    const title=await user.findOne({
      _id:req.body._id})
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

app.post('/user/change',authorization,async(req,res)=>{
  try{
      const change=await user.findOneAndUpdate({_id:req.body.id,'labels.title':req.body.title},
        {$set:{'labels.$.iscomplete':true}})
        
        res.status(200).json({message:"success",data:change})
  }catch(error){
    res.status(200).json({message:"failed"})
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

app.post('/productadd',async(req,res)=>{
  try{
    const pro=await product.findOneAndUpdate({user_name:req.body.user_name},{$push:{'product.0.phone':{
      phone_type:req.body.phone_type,
      phone_name:req.body.phone_name,
      phone_price:req.body.phone_price
      

    }}},{new:true})
    res.status(200).json({message:"success",data:pro})

  }catch(error){
    res.status(500).json({message:"failed"})
  }//index
})
      

app.post('/product/laptop',async(req,res)=>{
  try{
    const laptop=await product.findOneAndUpdate({user_name:req.body.user_name},{$push:{'product.0.laptop':{
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


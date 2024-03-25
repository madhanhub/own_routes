const jsonwebtoken = require("jsonwebtoken");

const authorization = function (req,res,next){
    console.log(req.headers)
    const authHeader = req.headers['authorization']
    const token  = authHeader && authHeader.split(' ')[1]
   //const token = req.params.token
   console.log(authHeader)
   if(token==null) return res.sendStatus(401)
   try {
       let tokengen =  jsonwebtoken.verify(token,process.env.SECRET);
       //console.log(tokenResult.iat)
         
       if (tokengen) {
           req.id=tokengen.id
           req.user_name=tokengen.user_name
           req.email=tokengen.email
           
           next()  
       } else {
           res.status(500).json({
               message:"Something wrong"
           })
       }  
   } catch (error) {
       return res.status(401).json({
        message:error.message
    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
   }
   
   
};
//https://codeforgeek.com/refresh-token-jwt-nodejs-authentication/
module.exports = authorization;

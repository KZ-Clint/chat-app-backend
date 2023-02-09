const User = require('../models/userModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

//CREATE ACCESS TOKEN
const createAccessToken = (_id) => {
  return jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '12d' } )
}

const registerUser = async (req, res) => {
     const { username, email, password, termsAndConditions } = req.body
   
    try{ 
     //generate new hashed password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash( password, salt )
       //create new user
       const newUser = new User({
          username,
          email,
          password:hashedPassword,
          termsAndConditions
       })
     //save user and return response
        const user = await newUser.save();
        res.status(200).json({ user })

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const loginUser = async (req, res) => {
     const { email, password } = req.body
   
    try{ 
         const user = await User.findOne({ email })
         if(!user){
           return res.status(404).json({error : "User not found"})
         }
         const match = await bcrypt.compare(password, user.password)

         if(!match) {
          return res.status(400).json({error : "Invalid Password"}) 
         }
         //CREATE TOKEN
         const access_token = createAccessToken(user._id)
         res.status(200).json({msg : "Login Successful", user, access_token})
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 



module.exports = { registerUser, loginUser }
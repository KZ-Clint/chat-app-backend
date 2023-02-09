const User = require('../models/userModel')
 const bcrypt = require("bcrypt")

const updateUser = async (req, res) => {
    //  const { username, email, password, termsAndConditions } = req.body
     const {id} = req.params
    try{ 
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt)  
        }      
        const user = await User.findByIdAndUpdate(id, { $set: req.body }, {new:true} )
        res.status(200).json({ msg: "Account has been updated",  user })

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const deleteUser = async (req, res) => {
     const {id} = req.params
    try{ 
        const user = await User.findByIdAndDelete(id)
        res.status(200).json({ msg: `User has been deleted`,  user })

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 
 const getFriend = async (req, res) => {
    const {userId} = req.params
    try{
        const user = await User.findById(userId)
        const friends = await Promise.all(
            user.followings.map( (followerId) => {
                return User.findById(followerId)
            } )
        )
        let friendList = []
        friends.map( (friend) => {
            const {_id, username, profilePicture } = friend
            friendList.push({ _id, username, profilePicture });
        }  )
        res.status(200).json({friendList})
    } catch(err) {
        console.log({error: err.message})
    }
}


  const getSingleUser = async (req, res) => {
     const {userId} = req.query
     const {username} = req.query
    try{ 
        const user = userId ? await User.findById(userId) : await User.findOne({username:username}) 
        const {password, updatedAt, ...other} = user._doc
        
        res.status(200).json({ msg: `User has been found`, other })

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const getLoggedUser = async (req, res) => {
    const {_id} = req.user
   try{ 
       const user =  await User.findById(_id) 
       const {password, updatedAt, ...other} = user._doc
       res.status(200).json({ msg: `User has been found`, other })

     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
} 


 const followUser = async (req, res) => {
    const {id} = req.params
    const {userId} = req.body
   try{ 
       if(userId === id ){
         return res.status(400).json({error : "You cant follow yourself"})
       }
        const user = await User.findById(id)
        const currentUser = await User.findById(userId)
        if( user.followers.includes(userId) ) {
            return res.status(400).json({error : "You already follow this user"})
        }
        const fuser = await user.updateOne({ $push:{ followers: userId } })
        const cuser = await currentUser.updateOne({ $push:{ followings: id } })
        res.status(200).json({ msg: `User has been followed`,  fuser, cuser })

     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
} 

const unfollowUser = async (req, res) => {
    const {id} = req.params
    const {userId} = req.body
   try{ 
       if(userId === id ){
         return res.status(400).json({error : "You cant unfollow yourself"})
       }
        const user = await User.findById(id)
        const currentUser = await User.findById(userId)
        if( !user.followers.includes(userId) ) {
            return res.status(400).json({error : "You do not follow this user"})
        }
        const fuser = await user.updateOne({ $pull:{ followers: userId } })
        const cuser = await currentUser.updateOne({ $pull:{ followings: id } })
        res.status(200).json({ msg: `User has been unfollowed`,  fuser, cuser })

     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
} 

module.exports = { updateUser, deleteUser, getSingleUser, getLoggedUser, followUser, unfollowUser, getFriend }
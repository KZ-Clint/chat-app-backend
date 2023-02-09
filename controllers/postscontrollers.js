const Post = require('../models/postModel')
const User = require('../models/userModel')
const bcrypt = require("bcrypt")

const postPost = async (req, res) => {
   
    try{ 
       const newPost = new Post(req.body)
        const savedPost = await newPost.save();
        res.status(200).json({ savedPost })

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const updatePost = async (req, res) => {
    const {id} = req.params
    const {userId} = req.body
    try{ 
       const post = await Post.findById(id)
       console.log( id, post._id, userId , post.userId )
       if(post.userId !== userId ){
          return res.status(400).json({error : "You can only update your post"})
       }
       const updatedPost = await post.updateOne({ $set: req.body })
        res.status(200).json({ msg: "Post updated successfully", updatedPost })

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const deletePost = async (req, res) => {
    const {id} = req.params
    const {userId} = req.body
    try{ 
       const post = await Post.findById(id)
       if(post.userId !== userId ){
          return res.status(400).json({error : "You can only delete your post"})
       }
        await post.deleteOne()
        res.status(200).json({ msg: "Post deleted successfully"})

      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const likePost = async (req, res) => {
   const {id} = req.params
   const {userId} = req.body
  try{ 
     
       const post = await Post.findById(id)
      if(!post.likes.includes(userId) ) {
          await post.updateOne({ $push:{ likes: userId } })
          res.status(200).json({ msg: `Post has been liked`})
      } else {
         await post.updateOne({ $pull:{ likes: userId } })
         res.status(200).json({ msg: `Post has been disliked`})
      }
     
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

const getSinglePost = async (req, res) => {
   const {id} = req.params
  try{ 
      const post = await Post.findById(id)
      res.status(200).json({ msg: `Post has been found`,  post })

    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

const getTimelinePost = async (req, res) => {
   const {userId} = req.params

  try{ 
      const currentUser = await User.findById(userId)
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
         currentUser.followings.map( (friendId) => {
           return  Post.find({userId: friendId})
         } )
      )
      res.status(200).json({ msg: `Post has been found`, userPosts: userPosts.concat(...friendPosts) })

    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

const getAllUserPost = async (req, res) => {
    const {username} = req.params
 
   try{ 
       const currentUser = await User.findOne({username:username})
       const userPosts = await Post.find({ userId: currentUser._id });
    
       res.status(200).json({ msg: `Post has been found`, userPosts })
 
     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
 } 


module.exports = { postPost, updatePost, deletePost, likePost, getSinglePost, getTimelinePost, getAllUserPost }
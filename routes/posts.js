const express = require('express')
const { postPost, updatePost, deletePost, likePost, getSinglePost, getTimelinePost, getAllUserPost } = require('../controllers/postscontrollers')

const router = express.Router()

//CREATE A POST
router.post( "/", postPost )

//UPDATE A POST
router.put( "/:id", updatePost )

//DELETE A POST
router.delete( "/:id", deletePost )

//LIKE A POST
router.put( "/:id/like", likePost )

//GET A POST
router.get( "/:id", getSinglePost )

//GET TIMELINE POSTS
router.get( "/timeline/:userId", getTimelinePost )

//GET ALL USER POSTS
router.get( "/profile/:username", getAllUserPost )

module.exports = router
const express = require('express')
const { updateUser, deleteUser, getSingleUser, followUser, unfollowUser, getLoggedUser, getFriend } = require('../controllers/userscontrollers')

const router = express.Router()

//UPDATE A USER
router.put( "/:id", updateUser )
//DELETE USER
router.delete( "/:id", deleteUser )
//GET FRIENDS
router.get( "/friends/friends/:userId", getFriend )
//GET A USER
router.get( "/", getSingleUser )
//FOLLOW A USER
router.put( "/:id/follow", followUser )
//unfollow a user
router.put( "/:id/unfollow", unfollowUser )


// REQUIRE AUTH FOR ALL WORKOUT ROUTES
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)

//GET LOGGED USER
router.get( "/logged", getLoggedUser )



module.exports = router
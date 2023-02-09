const express = require('express')
const { postConvo, getConvo, getSpecifiedConvo } = require('../controllers/conversationcontrollers')

const router = express.Router()

//NEW CONVO
router.post( "/", postConvo )
//GET CONVO OF A USER
router.get( "/:userId", getConvo )
//GET CONVO OF A USER
router.get( "/find/:firstUserId/:secondUserId", getSpecifiedConvo )

module.exports = router
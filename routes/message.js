const express = require('express')
const { postMessage, getMessage } = require('../controllers/messagecontrollers')

const router = express.Router()

//NEW MESSAGE
router.post( "/", postMessage )

//GET MESSAGE
router.get( "/:conversationId", getMessage )


module.exports = router
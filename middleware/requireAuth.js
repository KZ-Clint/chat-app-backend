const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async ( req, res, next ) => {

    //VERIFY AUTHENTICATION
    const { authorization } = req.headers
    console.log("why am i here first")
    if(!authorization) {
        console.log("why am i here")
        return res.status(401).json( { error: "Authorization token required" } )
    }
    const token = authorization.split( ' ' )[1]
    console.log(token)
    try{
       const {_id} = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET )

       req.user = await User.findOne({_id})
    //    console.log("require auth ", req.user)
       next()

    }catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not authorized' })
    }

}

module.exports = requireAuth
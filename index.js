const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const convoRoute = require('./routes/conversation')
const messageRoute = require('./routes/message')
const { createServer } = require("http")
const { Server } = require("socket.io")

const app = express()

//MIDDLEWARE
app.use( bodyParser.json() )
app.use( express.json() )
app.use(helmet())
app.use(morgan("common"))

app.use( cors( {
    origin:'*'
}) )

const server = createServer(app)
const io = new Server( server, {
    cors:{
        origin: "*",
        methods: [ "GET", "POST","DELETE", "PATCH" ],
    }
} )

let users = []

const addUser = (userId, socketId) => {
    !users.some( user=> user.userId === userId) &&
    users.push({ userId, socketId}) 
}

const removeUser = (socketId) => {
    users =  users.filter( (user) => {
       return user.socketId !== socketId
    } )
}

const getUser = (receiverId) => {
    return users.find( (user) =>  user.userId === receiverId)
}

io.on("connection",  (socket) => {
    // console.log( `User Connected: ${socket.id} ` )
    //TAKE USERID AND SOCKETID FROM USER
    socket.on("addUser", (userId) => {
    
          addUser(userId, socket.id)
       
          io.emit("getUsers", users )
    } )

    //SEND AND GET MESSAGE
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
       
           const receiver = getUser(receiverId)
           console.log(receiver)
           if(receiver) {  
           io.to(receiver.socketId).emit("getMessage", {
              senderId, text
           } )
        }
    } )

    socket.on("disconnect", () => {
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users )
    } )



} )

app.use( '/api/users', userRoute  )
app.use( '/api/auth', authRoute  )
app.use( '/api/posts', postRoute  )
app.use( '/api/conversation', convoRoute  )
app.use( '/api/message', messageRoute  )

mongoose.set("strictQuery", false);
const dburi = process.env.DB_CONNECTION
mongoose.connect(dburi)
console.log('connected to db')

server.listen(process.env.PORT)
// app.listen(process.env.PORT)
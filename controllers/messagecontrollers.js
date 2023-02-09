const Message = require('../models/messageModel')

const postMessage = async (req, res) => {
     
    const newMessage = new Message(req.body)
    try{ 
       const message = await newMessage.save()
       res.status(200).json({ message })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const getMessage = async (req, res) => {
    const { conversationId } = req.params
   
  try{ 
     const message = await Message.find({ conversationId:conversationId })
     res.status(200).json({ message })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

module.exports = { postMessage, getMessage }
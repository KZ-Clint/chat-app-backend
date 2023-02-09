const Conversation = require('../models/conversationModel')

const postConvo = async (req, res) => {
      const { senderId, recieverId } = req.body
      console.log(senderId, recieverId)
    const newConversation = new Conversation({
        members:[ senderId, recieverId ]
    })
    try{ 
       const convo = await newConversation.save()
       res.status(200).json({ convo })
      } catch (err) {
          console.log({error: err.message})
          res.status(500).json({ error : err.message })
      }
 } 

 const getConvo = async (req, res) => {
    const { userId } = req.params
   
  try{ 
     const convo = await Conversation.find({
        members:{ $in:[userId] }
     })
     res.status(200).json({ convo })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

const getSpecifiedConvo = async (req, res) => {
    const { firstUserId } = req.params
    const { secondUserId } = req.params
   console.log("im here")
  try{ 
     const convo = await Conversation.findOne({
        members:{ $all:[firstUserId, secondUserId] }
     })
     res.status(200).json({ convo })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
} 

module.exports = { postConvo, getConvo, getSpecifiedConvo }
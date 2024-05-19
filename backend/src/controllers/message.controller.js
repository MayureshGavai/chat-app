import asyncHandler from "express-async-handler";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/messages.model.js";

export const sendMessageController = asyncHandler(async(req,res) => {
    const {content,chatId} = req.body

    if(!content || !chatId){
        console.log("Invalid data passed")
        return res.sendStatus(400)
    }

    let newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId
    }

    try{
        let message = await Message.create(newMessage)
        message = await message.populate("sender","name image")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path : "chat.users",
            select : "name image email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage : message})
        res.status(200).json(message)
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})


export const allMessagesController = asyncHandler(async(req,res)=>{
    try {
        const messages = await Message.find({chat : req.params.chatId})
            .populate("sender","name image email")
            .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
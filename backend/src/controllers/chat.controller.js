import asyncHandler from "express-async-handler";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

export const accesschatController = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      message: "UserId param not sent with request",
    });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email image",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).json(FullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export const fetchchatsController = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const results = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email image",
    });
    res.status(200).send(results);
  } catch (err) {
    res.status(400).json({ message: error.message });
  }
});

export const creategroupController = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


export const renamegroupController = asyncHandler(async(req,res)=>{
  const {chatId,chatName} = req.body

  const updatedChat = await Chat.findByIdAndUpdate(chatId,{chatName},{new:true}).populate("users","-password").populate("groupAdmin","-password")

  if(!updatedChat){
    res.status(404).send("Chat not found")
  }else{
    res.status(200).json(updatedChat)
  }
})


export const removefromgroupController = asyncHandler(async(req,res)=>{
  const {chatId,userId} = req.body
  const removed = await Chat.findByIdAndUpdate(chatId,{$pull : {users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password")

  if(!removed){
    res.status(404).send("Chat not found")
  }else{
    res.status(200).json(removed)
  }

})


export const addtogroupController = asyncHandler(async(req,res) => {
  const {chatId,userId} = req.body
  const added = await Chat.findByIdAndUpdate(chatId,{$push : {users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password")

  if(!added){
    res.status(404).send("Chat not found")
  }else{
    res.status(200).json(added)
  }
  
})
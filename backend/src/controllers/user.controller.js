import asyncHandler from "express-async-handler";
import { User } from "../models/user.model.js"
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs"

export const alluserController = asyncHandler(async(req,res)=>{
    const keyword = req.query.search 
    ?  {
        $or : [
            {name : {$regex : req.query.search , $options : "i"}},
            {email : {$regex : req.query.search , $options : "i"}},
        ]
    }: {}

    const users = await User.find(keyword).find({_id : {$ne : req.user._id}})
    res.status(200).json({users})
    console.log(keyword)
})


export const signupController = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        message: "Please Enter All Fields",
      });
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400).json({
            error: "User is already existed",
          });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const user = await User.create({
        name,
        email,
        password:hashedPassword,
        image
    })

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            image : user.image,
            isAdmin : user.isAdmin,
            token : generateToken(user._id)
        })
    }else{
        res.status(400).json({
            message:"failed to create user"
        })
    }

  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      error: "Internal server error for signup",
    });
  }
});

export const signinController = asyncHandler(async (req,res)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
        return res.status(400).json({error:"User does not exists"})
        }

        const validatePassword = await bcrypt.compare(password,user.password)

        if(user && validatePassword){
            return res.status(201).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                image : user.image,
                isAdmin : user.isAdmin,
                token : generateToken(user._id)
            })
        }else{
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }

    }catch(err){
        console.log("error",err)
        res.status(500).json({
            message : "internal server error for signin"
        })
    }
})
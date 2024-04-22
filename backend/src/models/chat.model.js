import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    chatName : {
        type:String,
        trim:true
    },
    isGroupChat : {
        type:Boolean,
        default:false
    },
    users : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lastMessage : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Messages"
    },
    groupAdmin : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{timestamps:true}
)

export const Chat = mongoose.model("chat",chatSchema)
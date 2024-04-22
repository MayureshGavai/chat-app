import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    email : {
        type:String,
        unique : true,
        required : true
    },
    password : {
        type:String,
        required : true
    },
    image : {
        type:String,
        required : true
    },
    isAdmin : {
        type:Boolean,
        required : true,
        default : false
    },

},
{timestamps : true}
)

export const User = mongoose.model('users',userSchema)
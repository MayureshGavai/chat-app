import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongodb connected on ${connect.connection.host}`)
    }catch(error){
        console.log(error.message)
        process.exit(1)
    }
}

export default connectDB
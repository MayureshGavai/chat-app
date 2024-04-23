import express from "express"
import morgan from "morgan"
import cors from "cors"
import { chats } from "./src/data/data.js"
import { configDotenv } from "dotenv"
import connectDB from "./src/config/dbConfig.js"
import userRoutes from "./src/routes/user.route.js"
import chatRoutes from "./src/routes/chat.route.js"
import { errorHandler, notFound } from "./src/middleware/error.middleware.js"

configDotenv()
connectDB()
const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
// app.use(notFound())
// app.use(errorHandler())

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)

const PORT = process.env.PORT || 3000


app.get("/",(req,res)=>{
    res.json({message:'hello world'})
})

app.get("/api/chats",(req,res)=>{
    res.status(200).json(chats)
})

app.get("/api/chats/:id",(req,res)=>{
    const singleChatId = req.params.id
    const findChat = chats.filter(chat => chat._id === singleChatId)
    res.status(200).json(findChat)
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import {dbConnect} from './dbConfig/db.js'
import routes from './routes/routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(morgan('dev'))
dbConnect();

app.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "welcome to book management system backend server ✌"
    })
})

app.use('/api', routes)

app.listen(4000,()=>{
    try{
        console.log("server connected successfully!");
    }
    catch(error)
    {
        console.log("error in server connection",error.message);
    }
})
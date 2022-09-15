import {studentModel, bookModel} from '../models/dbModels.js'
import { generateTokenStudent } from '../utils/generateToken.js'



/////////////////////signup logic/////////////////////////////////////////////
export const studentSignUp = async(req,res)=>{
    const {name, username, password, email, stream, year, roll} = req.body
    console.log(req.body);
        try{
        const newStudent = new studentModel({
            name, username, password, email, stream, year, roll
        })
        const createStudent = await newStudent.save()
        if(createStudent){
            res.status(200).json({
                success:true,
                message:"You have signed up successfully 😊",
                data: createStudent
            })
        }
        else{
            res.status(400).json({
                success: false,
                message:"Something went wrong 😢"
            })
        }
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}



//////////////////////////login logic//////////////////////////////////////////////
export const studentLogin = async(req,res)=>{
    const {username, password} = req.body
    try{
        const findStudent = await studentModel.findOne({username})
        if(findStudent){
            if(findStudent.checkpassword(password)){
                res.status(200).json({
                    success: true,
                    message : "Successfully Logged in!",
                    data: findStudent,
                    token : generateTokenStudent(findStudent._id)
                })
            }
            else{
                res.status(400).json({
                    success: false,
                    message: "Password not matched!"
                })
            }
        }
        else{
            res.status(400).json({
                success : false,
                message : "User does not exist!"
            })
        }
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}



////////////////////////////view all books/////////////////////////////////////
export const viewAllBooks = async(req,res)=>{
        const allBooks = await bookModel.find({},
            {Title:1,
            Author:1,
            Genre:1,
            SubGenre :1,
            Publisher:1})
        try{
        if(allBooks){
            res.status(200).json({
                success: true,
                message: "All book details fetched successfully!",
                data : allBooks
            })
        }
    }
    catch(error){
        res.status(400).json({
            success: false,
            messgae : error.message
        })
    }
}

////////////////////////////view all books by genre/////////////////////////
export const viewByGenre = async(req,res)=>{
    const {genre} = req.params
    const allByGenre = await bookModel.find({Genre:genre},
        {Title:1,
        Author:1,
        Genre:1,
        SubGenre :1,
        Publisher:1})
    try{
        // console.log(allByGenre);
    if(allByGenre){
        res.status(200).json({
            success: true,
            message: "All book details fetched successfully!",
            data : allByGenre
        })
    }
}
catch(error){
    res.status(400).json({
        success: false,
        messgae : error.message
    })
}
}

////////////////////////////view all books by SubGenre/////////////////////////////////////
export const viewBySubgenre = async(req,res)=>{
    const {subgenre} = req.params
    console.log(req.params);
    const allBySubgenre = await bookModel.find({SubGenre:subgenre},
        {Title:1,
        Author:1,
        Genre:1,
        SubGenre :1,
        Publisher:1})
    try{
    if(allBySubgenre){
        res.status(200).json({
            success: true,
            message: "All book details fetched successfully!",
            data : allBySubgenre
        })
    }
}
catch(error){
    res.status(400).json({
        success: false,
        messgae : error.message
    })
}
}

////////////////////////////view all books by SubGenre/////////////////////////////////////
export const viewByPublisher = async(req,res)=>{
    const { publisher } = req.params
    const allByPublisher = await bookModel.find({Publisher:publisher},
        {Title:1,
        Author:1,
        Genre:1,
        SubGenre :1,
        Publisher:1})
    try{
    if(allByPublisher){
        res.status(200).json({
            success: true,
            message: "All book details fetched successfully!",
            data : allByPublisher
        })
    }
}
catch(error){
    res.status(400).json({
        success: false,
        messgae : error.message
    })
    }
}

//////////////////view my issued books details/////////////////////
export const viewIssuedBooks = async(req,res)=>{
    const {id} = req.params
    try{
        const issuedBooks = await bookModel.find({Student_ID:id},{
            Title:1,
            Author:1,
            Genre:1,
            SubGenre:1,
            Issue_date:1,
            Return_date:1
        })
        if(issuedBooks){
            res.status(200).json({
                success:true,
                message: "Issued book details are fetched successfully",
                data: issuedBooks
            })
        }
        else{
            res.status(400).json({
                success: false,
                message: "Something went erong",
            })
        }
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
}
}
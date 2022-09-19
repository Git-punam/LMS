import {studentModel, bookModel} from '../models/dbModels.js'
import { generateTokenStudent } from '../utils/generateToken.js'
import bcrypt from 'bcrypt'


/**
 * @description Student signup
 * @route POST /api/student/signup
 * @access public
 */
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


/**
 * @description Student login
 * @route POST /api/student/login
 * @access public
 */
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



/**
 * @description Update profile details
 * @route POST /api/student/update-profile/:studentId
 * @access private
 */
 export const updateStudentProfile = async(req,res)=>{
    const {studentId} = req.params
    try{
        let { name, username, password, email, stream, year, roll } = req.body
        if (password) password = await bcrypt.hash('password',10);
        const findTheStudent = await studentModel.findByIdAndUpdate({_id:studentId},{
            name, username, password, email, stream, year, roll
        })
        if(findTheStudent){
            res.status(200).json({
                success : true,
                message: "profile updated successfully",
                data: findTheStudent
            })
        }
        else{
            res.status(400).json({
                success : true,
                message : "something went wrong"
            })
        }
    }
    catch(error){
        res.status(400).json({
            success: true,
            message : error.message

        })
    }
}


/**
 * @description View all books
 * @route GET /api/student/view-all-books
 * @access public
 */
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

/**
 * @description Filter books by Genre
 * @route GET /api/student/view-selected-book-genre/:genre
 * @access public
 */
export const viewByGenre = async(req,res)=>{
    const {genre} = req.params
    const allByGenre = await bookModel.find({Genre:genre},
        {Title:1,
        Author:1,
        Genre:1,
        SubGenre :1,
        Publisher:1})
    try{
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



/**
 * @description Filter books by SubGenre
 * @route GET /api/student/view-selected-book-subgenre/:subgenre
 * @access public
 */
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


/**
 * @description Filter books by Publisher
 * @route GET /api/student/view-selected-book-publisher/:publisher
 * @access public
 */
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

/**
 * @description View all issued book details
 * @route GET /api/student/my-issued-books/:bookId
 * @access private
 */
export const viewIssuedBooks = async(req,res)=>{
    const {bookId} = req.params
    try{
        const issuedBooks = await bookModel.find({Student_ID:bookId},{
            Title:1,
            Author:1,
            Genre:1,
            SubGenre:1,
            Issue_date:1,
            Return_date:1,
            Actual_return_date:1,
            Charges_Rs:1
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
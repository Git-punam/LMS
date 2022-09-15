import {adminModel, bookModel, studentModel} from '../models/dbModels.js'
import { generateTokenAdmin} from '../utils/generateToken.js'

/////////////////////signup logic/////////////////////////////////////////////
export const adminSignUp = async(req,res)=>{
    const {name, username, password, email}=req.body
        try{
        const newAdmin = new adminModel({
            name, username, password, email
        })
        const createAdmin = await newAdmin.save()
        if(createAdmin){
            res.status(200).json({
                success:true,
                message:"You have signed up successfully 😊",
                data: createAdmin
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

/////////////////////////////login logic////////////////////////////////////
export const adminLogin = async(req,res)=>{
    const { username, password } = req.body
        try{
        const findAdmin = await adminModel.findOne({username})
        if(findAdmin){
            if(findAdmin.checkpassword(password)){
                res.status(200).json({
                    success:true,
                    message:"You have logged in successfully 😊",
                    token:generateTokenAdmin(findAdmin._id)
                })
            }
            else{
                res.status(400).json({
                    success: false,
                    message:"Password not matched😢"
                })
            }
        }
        else{
            res.status(400).json({
                success: false,
                message:"User does not exist😢"
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

///////////////////////////////add-new-book///////////////////////////////////////
export const addNewBook = async(req,res)=>{
    const {Title, Author, Genre, SubGenre, Height, Publisher}= req.body
    try{
    const createNewBook = new bookModel({
        Title, Author, Genre, SubGenre, Height, Publisher})
    const newBook = await createNewBook.save()
    if(newBook){
        res.status(200).json({
            success: true,
            message: "Book details added successfully!",
            data : newBook
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

////////////////////////////////update a single book details/////////////////////
export const updateOldBook = async(req,res)=>{
    const {id} = req.params
    const {Title, Author, Genre, SubGenre, Height, Publisher} = req.body
    try{
        const updateBook = await bookModel.findByIdAndUpdate({_id:id},{
            Title, Author, Genre, SubGenre, Height, Publisher, Issue_date, Return_date, Actual_date, Charges_Rs, Student_ID
        })
        if(updateBook){
            res.status(200).json({
                success : true,
                message : "The selected book details updated successfully",
                data : updateBook
            })
        }
        else{
            res.status(400).json({
                status: false,
                messgae : "The selected book does not exist"
            })
        }
}
catch(error){
    res.status(400).json({
        success:false,
        message: error.message
    })
}
}

/////////////////////////////////////issue a book////////////////////////
export const issueBook = async(req,res)=>{
    const {id} = req.params
    const {Issue_date, Return_date, Actual_date, Student_ID } = req.body
    try{
        const studentDetails = await studentModel.findOne({_id:Student_ID},{
        name:1,
        stream:1,
        year:1,
        roll :1
        })
        const issueBook = await bookModel.findByIdAndUpdate({_id:id},{
            Issue_date, Return_date, Actual_date, Student_ID})
        if(issueBook){
            res.status(200).json({
                success : true,
                message : "The selected book is issued successfully",
                data : studentDetails
            })
        }
        else{
            res.status(400).json({
                status: false,
                messgae : "The selected book does not exist"
            })
        }
}
catch(error){
    res.status(400).json({
        success:false,
        message: error.message
    })
}
}

///////////////////////////////////delete a selected book details////////////////////
export const deleteBook = async(req,res)=>{
    const {id} = req.params
    try{
        const toDeleteBook = await bookModel.findByIdAndDelete({_id:id})
        if(toDeleteBook){
            res.status(200).json({
                success: true,
                message : "The selected book details deleted successfully",
                data : toDeleteBook
            })
        }
        else{
            res.status(400).json({
                success : false,
                message: "The book does not exist"
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
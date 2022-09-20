import {adminModel, bookModel, studentModel} from '../models/dbModels.js'
import { generateTokenAdmin } from '../utils/generateToken.js'
import { returnDateCalc, fineCalc } from '../utils/calc.js'
import bcrypt from 'bcrypt'


/**
 * @description Admin signup
 * @route POST /api/admin/signup
 * @access public
 */
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


/**
 * @description Admin login
 * @route POST /api/admin/login
 * @access public
 */
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


/**
 * @description Update profile details
 * @route PUT /api/admin/update-profile/:adminId
 * @access private
 */
export const updateAdminProfile = async(req,res)=>{
    const { adminId } = req.params
    try{
        let { name, username, password, email } = req.body
        if(password) password = await bcrypt.hash(password,10);
        const findTheAdmin = await adminModel.findByIdAndUpdate({_id:adminId},{
            name, username, password, email
        })
        if(findTheAdmin){
            res.status(200).json({
                success : true,
                message: "profile updated successfully",
                data: findTheAdmin
            })
        }
        else{
            res.status(400).json({
                success : false,
                message : "something went wrong"
            })
        }
    }
    catch(error){
        res.status(400).json({
            success: false,
            message : error.message
        })
    }
}



/**
 * @description Add new book details
 * @route POST /api/admin/add-new-book
 * @access private
 */
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


/**
 * @description Update book details
 * @route PUT /api/admin/update-old-book/:bookId
 * @access private
 */
export const updateOldBook = async(req,res)=>{
    const {bookId} = req.params
    const {Title, Author, Genre, SubGenre, Height, Publisher} = req.body
    try{
        const updateBook = await bookModel.findByIdAndUpdate({_id:bookId},{
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



/**
 * @description Issue book 
 * @route PUT /api/admin/issue-book/:bookId
 * @access private
 */
export const issueBook = async(req,res)=>{
    const { bookId } = req.params
    const { Issue_date, Student_ID } = req.body
    try{
        const studentDetails = await studentModel.findOne({_id:Student_ID},{
        name:1,
        stream:1,
        year:1,
        roll :1
        })
        let Return_date = '';
        if(studentDetails) Return_date = returnDateCalc(Issue_date,Return_date);
        else{
            res.status(400).json({
                status: false,
                messgae : "The student does not exist"
            })
        }
        const issueBook = await bookModel.findByIdAndUpdate({_id:bookId},{
            Issue_date, Return_date, Student_ID})
        if(issueBook){
            res.status(200).json({
                success : true,
                message : "The selected book is issued successfully",
                data : Return_date
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



/**
 * @description Return book (when a book is returned, late fine/charges will be calculated automatically based on the actual return date)
 * @route PUT /api/admin/return-book/:bookId
 * @access private
 */
 export const returnBook = async(req,res)=>{
    const { bookId } = req.params
    const { Actual_return_date } = req.body
    try{
            const findTheBook = await bookModel.findOne({_id:bookId},{Return_date:1})
            let Charges_Rs = 0;
            // console.log(findTheBook.Charges_Rs);
            if(findTheBook) 
            {Charges_Rs = fineCalc(findTheBook.Return_date, Actual_return_date);
                console.log(Charges_Rs);}
            else{
                res.status(400).json({
                    success : false,
                    message : "The book does not exist"
                })
            }
            const ChargesCalculated = await bookModel.findByIdAndUpdate({_id:bookId},{
                Actual_return_date, Charges_Rs})
            if(ChargesCalculated)
            {
                res.status(200).json({
                    success : true,
                    message : "The selected book is returned and fine calculated successfully",
                    data : ChargesCalculated
                })
            }
            else
            {
                res.status(400).json({
                    status: false,
                    messgae : "Something went wrong"
                })
            }
        }
    catch(error)
    {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}




/**
 * @description Delete book details
 * @route DELETE /api/admin/delete-book/:bookId
 * @access private
 */
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
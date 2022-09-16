import {adminModel, bookModel, studentModel} from '../models/dbModels.js'
import { generateTokenAdmin, } from '../utils/generateToken.js'

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
 * @route PUT /api/admin/update-old-book/:id
 * @access private
 */
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



/**
 * @description Issue book 
 * @route PUT /api/admin/issue-book/:id
 * @access private
 */
export const issueBook = async(req,res)=>{
    const {id} = req.params
    const {Issue_date, Actual_date, Student_ID } = req.body
    try{
        const studentDetails = await studentModel.findOne({_id:Student_ID},{
        name:1,
        stream:1,
        year:1,
        roll :1
        })

    // Return_date calculation
    //Issue_date format:dd-mm-yyyy
        let dd = 7 + Number(Issue_date.substr(0,2));//'substr(0,2)' extract substring from position 0 with length=2
        let mm = Number(Issue_date.substr(3,2));//'substr(3,2)' extract substring from position 3 with length=2
        let yyyy = Number(Issue_date.substr(6));//'substr(6)' extract rest of the substring from position 6
        
        //object for months having 31 days
        const arr31 = {
            1 : "january",
            3 : "march",
            5:  "may",
            7:  "july",
            8: "august",
            10: "october",
            12 : "december"
        }

        // object for months having 30 days
        const arr30 = {
            4 : "april",
            6 : "june",
            9:  "september",
            11:  "november",
        }

        //if the month is apr/jun/sep/nov
        if(Object.keys(arr30).includes(mm.toString())){
            if(Math.floor(dd/30) > 0) mm = mm + 1;
            dd = dd % 30;
        }   
        //if the month is jan/mar/may/jul/aug/oct/dec  
        else if(Object.keys(arr31).includes(mm.toString())) {
            if(Math.floor(dd/31) > 0) mm = mm + 1;
            dd = dd % 31;
        }       
        else {
            //checking leap year or not
                if( yyyy % 4 == 0 ) {
                    if( Math.floor(dd/29)>0) mm = mm + 1;
                    dd = dd % 29;
                }
                else { 
                    if( Math.floor(dd/28)>0) mm = mm + 1;
                    dd = dd % 28;
                }
        }
        if( Math.floor(mm/12) > 0) {yyyy = yyyy + 1; mm = mm % 12;}
        let ddS = (dd < 10) ? ('0'+ dd.toString()) : dd.toString()
        let mmS = (mm < 10) ? ('0'+ mm.toString()) : mm.toString()
        let yyS = yyyy.toString()
        let Return_date = ddS + '-'+ mmS + '-' + yyS 
        
        
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



/**
 * @description Delete book details
 * @route DELETE /api/admin/delete-book/:id
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
import {adminModel, bookModel, studentModel} from '../models/dbModels.js'
import { generateTokenAdmin } from '../utils/generateToken.js'
import bcrypt from 'bcrypt'




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
    const { adminId} = req.params
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

    // Return_date calculation
    //Issue_date format:dd-mm-yyyy
        let dd = 7 + Number(Issue_date.substr(0,2));//'substr(0,2)' extract substring from position 0 with length=2
        let mm = Number(Issue_date.substr(3,2));//'substr(3,2)' extract substring from position 3 with length=2
        let yyyy = Number(Issue_date.substr(6));//'substr(6)' extract rest of the substring from position 6

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
        
        
        const issueBook = await bookModel.findByIdAndUpdate({_id:bookId},{
            Issue_date, Return_date, Student_ID})
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
 * @description Return book 
 * @route PUT /api/admin/return-book/:bookId
 * @access private
 */
 export const returnBook = async(req,res)=>{
    const {bookId} = req.params
    const { Actual_return_date } = req.body
    try{
            const findTheBook = await bookModel.findOne({_id:bookId},{Return_date:1})
            let Charges_Rs=0;
            if(findTheBook)
            {
                //Charges_rs calculation
                //Issue_date,Actual_date format:dd-mm-yyyy
                let yyyyReturn = Number(findTheBook.Return_date.substring(6))//'substring(6)' extract rest of the substring from position 6
                let yyyyActual = Number(Actual_return_date.substring(6))

                let mmReturn = Number(findTheBook.Return_date.substring(3,5))//'substr(3,5)' extract substring from position 3 to 4
                let mmActual = Number(Actual_return_date.substring(3,5))

                let ddReturn = Number(findTheBook.Return_date.substring(0,2))//'substring(0,2)' extract substring from position 0 to 1
                let ddActual = Number(Actual_return_date.substring(0,2))

                //book returned in the same year
                if(yyyyActual-yyyyReturn == 0)
                {
                    //book returned in the same month
                    if(mmActual-mmReturn == 0) Charges_Rs = ddActual - ddReturn; 
                    //book returned in later months
                    else if(mmActual-mmReturn > 0)
                    {
                        //if the month is apr/jun/sep/nov in Return_date
                        if(Object.keys(arr30).includes(mmReturn.toString())) Charges_Rs = 30 - ddReturn;
                            //if the month is jan/mar/may/jul/aug/oct/dec in Return_date 
                        else if(Object.keys(arr31).includes(mmReturn.toString())) Charges_Rs = 31 - ddReturn;
                        else 
                        {
                            if( yyyyReturn % 4 == 0 ) Charges_Rs = 29 - ddReturn;
                            else Charges_Rs = 28 - ddReturn;
                        }
                        let count30 = 0;
                        let count31 = 0;
                        let count28 = 0;
                        let count29 = 0;
                        for(var i = mmReturn + 1; i < mmActual; i++)
                        {
                            if(Object.keys(arr30).includes(i.toString())) count30++;
                            //if the month is jan/mar/may/jul/aug/oct/dec in Return_date 
                            else if(Object.keys(arr31).includes(i.toString())) count31++;
                            else 
                            {   //the month is 'feb'
                                //checking leap year or not
                                if( yyyyReturn % 4 == 0 ) count29++;
                                else count28++;
                            }
                        }
                        Charges_Rs = Charges_Rs + (count30*30 + count31*31 + count29*29 + count28*28) + ddActual
                    }
                }
            }
            const ChargesCalculated = await bookModel.findByIdAndUpdate({_id:bookId},{Charges_Rs})
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
                    messgae : "The selected book does not exist"
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
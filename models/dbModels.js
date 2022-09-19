import mongoose from 'mongoose'
import bcrypt from 'bcrypt'



//model schema for student details
const studentSchema = new mongoose.Schema({
    name: {type: String},
    username:{type: String, required:true},
    password:{type: String, required:true},
    email : {type : String, required:true},
    stream: {type : String, required :true},
    year : {type : Number, required : true},
    roll: {type : Number, required : true}
},
{timestamps:true})
//for student-login, checking 'given password' and 'existing password' same or not
studentSchema.methods.checkpassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
//for student-signUp, whenever new registration happens
studentSchema.pre('save', async function(next){
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password,10)
    next()
})




//model schema for admin details
const adminSchema = new mongoose.Schema({
    name: {type: String},
    username:{type: String, required:true},
    password:{type: String, required:true},
    email : {type : String, required:true}
},
{timestamps:true})
//for admin login, checking 'given password' and 'existing password' same or not
adminSchema.methods.checkpassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
//for admin-signUp, whenever new registration happens
adminSchema.pre('save', async function(next){
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password,10)
    next()
})



//model schema for book details
const booksSchema = new mongoose.Schema({
    Title: {type: String, required:true},
    Author:{type: String},
    Genre:{type: String},
    SubGenre : {type: String},
    Height: {type : Number},
    Publisher:{type: String},
    Issue_date : {type: String},
    Return_date: {type: String},
    Actual_return_date: {type: String},
    Charges_Rs:{type:Number},
    Student_ID:{type:String} 
},
{timestamps:true})


export const adminModel = mongoose.model('Admin', adminSchema)
export const studentModel = mongoose.model('Students', studentSchema)
export const bookModel = mongoose.model('Books', booksSchema)
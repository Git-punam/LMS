import jwt from 'jsonwebtoken'
import dot from 'dotenv'

dot.config()

export const generateTokenStudent = (id)=>{
    return jwt.sign({_id:id},process.env.ACCESS_TOKEN_SECRET_STUDENT,{
        expiresIn:'24h'})
}

export const generateTokenAdmin = (id)=>{
    return jwt.sign({_id:id},process.env.ACCESS_TOKEN_SECRET_ADMIN,{
        expiresIn:'24h'})
}

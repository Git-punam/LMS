import jwt from "jsonwebtoken";
import { adminModel, studentModel}  from "../models/dbModels.js";
import env from "dotenv";

env.config();


///////////////for admin authorization///////////
export const authMiddlewareAdmin = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        let decodedId;
        await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_ADMIN,function (err, decoded) {
          if (err) {
            return res.status(403).json({
              status: false,
              message: err,
            });
          }
          decodedId = decoded._id;
        });
        // store Auth (- password) to req.user
        req.user = await adminModel.findById(decodedId).select("-Password");
        next();
    } 
    else {
      res.status(401).json({
        status: false,
        message: "Not Authorized, No token is present",
      });
    }
  } 
  catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        status: false,
        message: "Unauthorised",
      });
    } else {
      // token expired
      res.status(404).json({
        status: false,
        message: error,
      });
    }
  }
};




///////////////////for student authorization///////////
export const authMiddlewareStudent = async (req, res, next) => {
    let token;
    try {
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
          let decodedId;
          await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_STUDENT,function (err, decoded) {
            if (err) {
              return res.status(403).json({
                status: false,
                message: err,
              });
            }
            decodedId = decoded._id;
          });
          // store Auth (- password) to req.user
          req.user = await studentModel.findById(decodedId).select("-Password");
          next();
      } 
      else {
        res.status(401).json({
          status: false,
          message: "Not Authorized, No token is present",
        });
      }
    } 
    catch (error) {
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({
          status: false,
          message: "Unauthorised",
        });
      } else {
        // token expired
        res.status(404).json({
          status: false,
          message: error,
        });
      }
    }
  };
  


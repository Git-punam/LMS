import express from 'express'
import * as admin from '../controllers/admin.js'
import * as student from '../controllers/student.js'
import {authMiddlewareAdmin, authMiddlewareStudent} from '../middlewares/authMiddleware.js'


const router = express.Router()

//admin routes
router.post('/admin/signup', admin.adminSignUp)
router.post('/admin/login', admin.adminLogin)
router.put('/admin/update-profile/:adminId',authMiddlewareAdmin, admin.updateAdminProfile)
router.post('/admin/add-new-book', authMiddlewareAdmin, admin.addNewBook)
router.post('/admin/update-old-book/:bookId', authMiddlewareAdmin, admin.updateOldBook)
router.delete('/admin/delete-book/:bookId', authMiddlewareAdmin, admin.deleteBook)
router.put('/admin/issue-book/:bookId', authMiddlewareAdmin, admin.issueBook)
router.put('/admin/return-book/:bookId', admin.returnBook)



//student routes
router.post('/student/signup', student.studentSignUp)
router.post('/student/login', student.studentLogin)
router.put('/student/update-profile/:studentId', authMiddlewareStudent, student.updateStudentProfile)
router.get('/student/view-all-books', student.viewAllBooks)
router.get('/student/view-selected-book-genre/:genre', student.viewByGenre)
router.get('/student/view-selected-book-subgenre/:subgenre', student.viewBySubgenre)
router.get('/student/view-selected-book-publisher/:publisher', student.viewByPublisher)
router.get('/student/my-issued-books/:bookId', authMiddlewareStudent, student.viewIssuedBooks)

export default router
import express from 'express'
import * as admin from '../controllers/admin.js'
import * as student from '../controllers/student.js'
import {authMiddlewareAdmin, authMiddlewareStudent} from '../middlewares/authMiddleware.js'


const router = express.Router()

//admin routes
router.post('/admin/signup', admin.adminSignUp)
router.post('/admin/login', admin.adminLogin)
router.post('/admin/add-new-book', authMiddlewareAdmin, admin.addNewBook)
router.put('/admin/update-old-book/:id', authMiddlewareAdmin, admin.updateOldBook)
router.delete('/admin/delete-book/:id', authMiddlewareAdmin, admin.deleteBook)
router.put('/admin/issue-book/:id', authMiddlewareAdmin, admin.issueBook)

//student routes
router.post('/student/signup', student.studentSignUp)
router.post('/student/login', student.studentLogin)
router.get('/student/view-all-books', student.viewAllBooks)
router.get('/student/view-selected-book-genre/:genre', student.viewByGenre)
router.get('/student/view-selected-book-subgenre/:subgenre', student.viewBySubgenre)
router.get('/student/view-selected-book-publisher/:publisher', student.viewByPublisher)
router.get('/student/my-issued-books/:id', authMiddlewareStudent, student.viewIssuedBooks)

export default router
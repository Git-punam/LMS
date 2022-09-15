import express from 'express'
import * as admin from '../controllers/admin.js'
import * as student from '../controllers/student.js'


const router = express.Router()

//admin routes
router.post('/admin/signup', admin.adminSignUp)
router.post('/admin/login', admin.adminLogin)
router.post('/admin/add-new-book', admin.addNewBook)
router.put('/admin/update-old-book/:id', admin.updateOldBook)
router.delete('/admin/delete-book/:id', admin.deleteBook)
router.put('/admin/issue-book/:id', admin.issueBook)

//student routes
router.post('/student/signup', student.studentSignUp)
router.post('/student/login', student.studentLogin)
router.get('/student/view-all-books', student.viewAllBooks)
router.get('/student/view-selected-book-genre/:genre', student.viewByGenre)
router.get('/student/view-selected-book-subgenre/:subgenre', student.viewBySubgenre)
router.get('/student/view-selected-book-publisher/:publisher', student.viewByPublisher)
router.get('/student/my-issued-books/:id', student.viewIssuedBooks)

export default router
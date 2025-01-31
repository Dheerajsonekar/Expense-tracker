const express = require('express');
const router = express.Router();

const {signupPost, loginPost, getUser, forgotPassword, resetPassword } = require('../controllers/userControllers');
const {expensePost, showExpenses , deleteExpense, getboard, downloadExpenses, getDownloadedFiles} = require('../controllers/expenseController');
const {addNotes, getnotes, deleteNotes} = require("../controllers/notesController")
const {createOrder, verifyPayment} = require('../controllers/paymentControllers');
const {authenticate} = require('../middleware/auth');

//User routes
router.post('/signup', signupPost);
router.post('/login', loginPost);
router.post("/forgotPassword", forgotPassword);
router.post("/password/resetPassword/:id", resetPassword);
router.get('/getuser', authenticate, getUser);

// expeense routes
router.post('/expense', authenticate, expensePost);
router.get('/showexpense',authenticate, showExpenses);
router.delete('/expense/:id',authenticate, deleteExpense);
router.get("/download", authenticate, downloadExpenses);
router.get("/downloaded-files", authenticate, getDownloadedFiles);

// notes routes
router.post('/notes', authenticate, addNotes);
router.get('/shownotes', authenticate, getnotes);
router.delete('/note/:id', authenticate, deleteNotes);

// payment routes
router.post('/premium', authenticate, createOrder);
router.post('/premium/verify', authenticate, verifyPayment);
router.get('/premium/leaderboard', authenticate, getboard);

module.exports = router;
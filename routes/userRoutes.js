const express = require('express');
const router = express.Router();

const {signupPost, loginPost, getUser, forgotPassword, resetPassword } = require('../controllers/userControllers');
const {expensePost, showExpenses , deleteExpense, getboard, downloadExpenses, getDownloadedFiles} = require('../controllers/expenseController');
const {createOrder, verifyPayment} = require('../controllers/paymentControllers');
const {authenticate} = require('../middleware/auth');

router.post('/signup', signupPost);
router.post('/login', loginPost);
router.post("/forgotPassword", forgotPassword);
router.post("/password/resetPassword/:id", resetPassword);
router.get('/getuser', authenticate, getUser);


router.post('/expense', authenticate, expensePost);
router.get('/showexpense',authenticate, showExpenses);
router.delete('/expense/:id',authenticate, deleteExpense);
router.get("/download", authenticate, downloadExpenses);
router.get("/downloaded-files", authenticate, getDownloadedFiles);


router.post('/premium', authenticate, createOrder);
router.post('/premium/verify', authenticate, verifyPayment);
router.get('/premium/leaderboard', authenticate, getboard);

module.exports = router;
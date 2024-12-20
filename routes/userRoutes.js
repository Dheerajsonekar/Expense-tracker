const express = require('express');
const router = express.Router();

const {signupPost, loginPost, getUser } = require('../controllers/userControllers');
const {expensePost, showExpenses , deleteExpense, getboard} = require('../controllers/expenseController');
const {createOrder, verifyPayment} = require('../controllers/paymentControllers');
const {authenticate} = require('../middleware/auth');

router.post('/signup', signupPost);
router.post('/login', loginPost);
router.get('/getuser', authenticate, getUser);

router.post('/expense', authenticate, expensePost);
router.get('/showexpense',authenticate, showExpenses);
router.delete('/expense/:id',authenticate, deleteExpense);


router.post('/premium', authenticate, createOrder);
router.post('/premium/verify', authenticate, verifyPayment);
router.get('/premium/leaderboard', authenticate, getboard);

module.exports = router;
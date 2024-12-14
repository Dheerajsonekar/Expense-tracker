const express = require('express');
const router = express.Router();

const {signupPost, loginPost } = require('../controllers/userControllers');
const {expensePost, showExpenses} = require('../controllers/expenseController');
const {authenticate} = require('../middleware/auth');

router.post('/signup', signupPost);
router.post('/login', loginPost);
router.post('/expense', authenticate, expensePost);
router.get('/showexpense',authenticate, showExpenses);

module.exports = router;
const express = require('express');
const router = express.Router();

const {signupPost, loginPost } = require('../controllers/userControllers');
const {expensePost, showExpenses} = require('../controllers/expenseController');

router.post('/signup', signupPost);
router.post('/login', loginPost);
router.post('/expense', expensePost);
router.get('/showexpense', showExpenses);

module.exports = router;
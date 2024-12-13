const express = require('express');
const router = express.Router();

const {signupPost, loginPost } = require('../controllers/userControllers');

router.post('/signup', signupPost);
router.post('/login', loginPost);

module.exports = router;
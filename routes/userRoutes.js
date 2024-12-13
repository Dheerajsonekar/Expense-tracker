const express = require('express');
const router = express.Router();

const {signupPost } = require('../controllers/userControllers');

router.post('/signup', signupPost);


module.exports = router;
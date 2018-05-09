var express = require('express');
var router = express.Router();

const ctrlAuth = require('../controllers/auth');

router.get('/google', ctrlAuth.google);
router.get('/google/callback', ctrlAuth.googleCallback);
router.get('/logout', ctrlAuth.logout);

module.exports = router;

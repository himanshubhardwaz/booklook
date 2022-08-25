const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log("Index Router LOADED");

router.get('/', homeController.home);
router.get('/about', homeController.about);



router.use('/users',require('./users'));
module.exports = router;
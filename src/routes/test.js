const express = require('express');

const testController = require('../controller/item')

const router = express.Router();

router.get('/',testController.getCustomResponse)


module.exports = router;


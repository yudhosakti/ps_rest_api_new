const express = require('express');

const otherController = require('../controller/other')

const router = express.Router();

router.post('/upload',otherController.uploadImage)

module.exports = router
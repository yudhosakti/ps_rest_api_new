const express = require('express');
const rentController = require('../controller/rent');
const router = express.Router();

router.get('/',rentController.getRentPsAllUser)
router.get('/:page',rentController.getRentPsAllUser)
router.get('/single/:id',rentController.getRentSingle)


module.exports = router;

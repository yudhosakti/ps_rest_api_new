const express = require('express');
const userController= require('../controller/user');
const router = express.Router();

router.get('/',userController.getALlUser);

router.get('/:id',userController.getSingleUser);

router.get('/rent/:id',userController.getRentPsSingleUser);

router.post('/',userController.createNewUser);

router.delete('/:id',userController.deleteSingleUser);

module.exports = router;


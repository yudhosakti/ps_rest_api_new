const express = require('express');
const userController= require('../controller/person');
const router = express.Router();

router.get('/',userController.getALlUser);
router.get('/:page',userController.getALlUser);

router.post('/login',userController.loginUser)

router.get('/single/:id',userController.getSingleUser);

router.get('/rent/:id',userController.getRentPsSingleUser);

router.post('/register',userController.createNewUser);

router.delete('/:id',userController.deleteSingleUser);

router.put('/:id',userController.updateSingleUser);

module.exports = router;


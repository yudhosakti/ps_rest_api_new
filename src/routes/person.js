const express = require('express');
const userController= require('../controller/person');
const router = express.Router();

router.get('/',userController.getALlUser);
router.get('/:page',userController.getALlUser);

router.post('/login',userController.loginUser)

router.get('/single/:id',userController.getSingleUser);

router.get('/rent/:id',userController.getRentPsSingleUser);

router.get('/bookmark/all',userController.getAllBookmarkById);

router.get('/bookmark/single',userController.getSingleBookmarkByIdUser);

router.post('/bookmark',userController.createBookmark);


router.post('/register',userController.createNewUser);
router.post('/register/admin',userController.createNewAdmin);

router.put('/:id',userController.updateSingleUser);

router.delete('/bookmark',userController.deleteBookmark);

router.delete('/:id',userController.deleteSingleUser);



module.exports = router;


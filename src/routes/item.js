const express = require('express');

const itemController = require('../controller/item.js')

const router = express.Router();

router.get('/',itemController.getAllItem);
router.get('/:page',itemController.getAllItem);
router.get('/single/:id',itemController.getSingleItemDetail);
router.post('/',itemController.createItem);
router.delete('/:id',itemController.deleteItem);
router.put('/:id',itemController.updateItem);



// // create post method
// router.post('/',itemController.addItem)

// //update
// router.patch('/:id',itemController.updateUser)

// router.delete('/:id',itemController.deleteItem)



module.exports = router;


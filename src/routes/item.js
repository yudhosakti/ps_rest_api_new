const express = require('express');

const itemController = require('../controller/item.js')

const router = express.Router();

router.get('/',itemController.getAllItem)

// create post method
router.post('/',itemController.addItem)

//update
router.patch('/:id',itemController.updateUser)

router.delete('/:id',itemController.deleteItem)



module.exports = router;


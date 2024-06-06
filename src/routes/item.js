const express = require('express');

const itemController = require('../controller/item.js')

const router = express.Router();

// Item Routes
router.get('/', itemController.getAllItem);
router.get('/search', itemController.getSearchItem);
router.get('/single/:id', itemController.getSingleItemDetail);
router.post('/', itemController.createItem);
router.post('/stock',itemController.increaseItemStock);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

// Paginated Items
router.get('/:page', itemController.getAllItem);

// Game Routes
router.get('/game/all', itemController.getAllGame);
router.get('/game/single', itemController.getSingleGame);
router.get('/game/filter', itemController.getAllGameByIdItem);
router.get('/game/search', itemController.getSearchGame);
router.post('/game', itemController.createNewGame);
router.post('/game/ps', itemController.createGameForPS);
router.put('/game/edit', itemController.updateGameData);
router.delete('/game/erase', itemController.deleteGame);
router.delete('/game/ps/erase', itemController.deletePSGame);

// Review Routes
router.post('/review', itemController.createReview);
router.put('/review', itemController.updateReview);
router.delete('/review', itemController.deleteReview);



// // create post method
// router.post('/',itemController.addItem)

// //update
// router.patch('/:id',itemController.updateUser)

// router.delete('/:id',itemController.deleteItem)



module.exports = router;


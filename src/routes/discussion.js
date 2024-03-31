const express = require('express');

const discussionController = require('../controller/discussion');

const router = express.Router();

router.get('/:id',discussionController.getAllChatById);

router.post('/',discussionController.addChat);

router.put('/:id',discussionController.updateChat);

router.delete('/:id',discussionController.deleteChat);


module.exports = router;
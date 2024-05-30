const forumController = require('../controller/forum');
const express = require('express');

const router = express.Router();

router.get('/',forumController.getAllForum);
router.get('/:page',forumController.getAllForum)

router.get('/single/:id',forumController.getSingleForum);
router.get('/single/chat/:id',forumController.getAllChatSingleForum)
router.post('/',forumController.addForum);
router.post('/chat',forumController.createMessage);
router.put('/chat',forumController.updateMessage);


router.put('/:id',forumController.updateForum);
router.delete('/chat',forumController.deleteMessageForum);

router.delete('/:id',forumController.deleteForum);

module.exports  = router;
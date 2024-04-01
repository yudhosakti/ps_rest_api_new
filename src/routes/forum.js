const forumController = require('../controller/forum');
const express = require('express');

const router = express.Router();

router.get('/',forumController.getAllForum);
router.get('/:page',forumController.getAllForum)

router.get('/single/:id',forumController.getSingleForum);
router.post('/',forumController.addForum);

router.put('/:id',forumController.updateForum);

router.delete('/:id',forumController.deleteForum);

module.exports  = router;
const express = require('express')
const serviceController = require('../controller/service')

const router = express.Router()


router.get('/group/:id',serviceController.getAllGroup)
router.get('/group/messages/:id',serviceController.getAllMessageSingleGroup)
router.post('/group',serviceController.createGroupChat)
router.post('/group/message',serviceController.createMessage)
router.put('/group/message/:id',serviceController.updateMessage)


module.exports = router
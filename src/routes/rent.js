const express = require('express');
const rentController = require('../controller/rent');
const router = express.Router();

router.get('/',rentController.getRentPsAllUser);
router.get('/:page',rentController.getRentPsAllUser);
router.get('/single/:id',rentController.getRentSingle);
router.get('/payment/detail',rentController.getPaymentDetail);
router.post('/payment',rentController.createPaymentMultipleItem)
router.delete('/payment',rentController.deleteRentMultipleItem)
router.delete('/log',rentController.deleteRentLog);
router.put('/payment',rentController.updateRent);

module.exports = router;

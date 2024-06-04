const express = require('express');
const rentController = require('../controller/rent');
const router = express.Router();

router.get('/',rentController.getRentPsAllUser);
router.get('/:page',rentController.getRentPsAllUser);
router.get('/single/:id',rentController.getRentSingle);
router.get('/payment/detail',rentController.getPaymentDetail);
router.post('/',rentController.createNewRent);
router.post('/payment',rentController.getPaymentLink);
router.post('/payment/multiple',rentController.createPaymentMultipleItem)
router.delete('/:id',rentController.deleteRent);
router.put('/payment',rentController.updateRent);

router.post('/testing/coba',rentController.testing)

module.exports = router;

const router = require('express').Router();
const Utils = require('../utils');

router.get('/:trackingId', async (req, res) => {
    const ohm = await Utils.getOhmByTrackingId(req.params.trackingId);
    res.send(ohm);
    // add error handling
})

router.post('/update/:trackingId', async (req, res) => {
    const ohm = await Utils.updateOhmDeliveryStatus(req.params.trackingId);
    res.send(ohm);
    // add error handling   
})

router.post('/finalize/:trackingId', async (req, res) => {
    const ohm = await Utils.finalizeDelivery(req.params.trackingId, req.body.status, req.body.comment);
    res.send(ohm);
    // add error handling
})

module.exports = router;
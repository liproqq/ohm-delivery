const utils = require('../src/utils');

describe('getOhmById:', () => {
    test('returns Ohm object', async () => {
        const ohm = await utils.getOhmById('1');
        expect(ohm).toBeDefined();
    });

    test('return undefined for invalid queries', async () => {
        const ohm = await utils.getOhmById('But it works on my machine');
        expect(ohm).toBeUndefined();
    });

    test('has a valid history', async () => {
        const ohm = await utils.getOhmById('1');
        const statuses = [ 'CREATED', 'PREPARING', 'READY', 'IN_DELIVERY','DELIVERED', 'REFUSED']
        const isValidStatus = statuses.includes(ohm.history[0].state)
        expect(isValidStatus).toBe(true);
    });
})
describe('getOhmByTrackingId:', () => {
    const trackingId = '1e62adfe'
    test('returns Ohm object', async () => {
        const ohm = await utils.getOhmByTrackingId(trackingId);
        expect(ohm).toBeDefined();
    });

    test('return undefined for invalid queries', async () => {
        const ohm = await utils.getOhmByTrackingId('it should work now');
        expect(ohm).toBeUndefined();
    });

    test('has a valid history', async () => {
        const ohm = await utils.getOhmByTrackingId(trackingId);
        const statuses = [ 'CREATED', 'PREPARING', 'READY', 'IN_DELIVERY','DELIVERED', 'REFUSED']
        const isValidStatus = statuses.includes(ohm.history[0].state)
        expect(isValidStatus).toBe(true);
    });
})

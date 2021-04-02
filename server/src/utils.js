const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');
const STATUS_FLOW = ['CREATED', 'PREPARING', 'READY', 'IN_DELIVERY']

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

async function getOhmById(id) {
  const _db = await db;
  const ohm = _db.get('ohms')
    .find({id: id })
    .value()
  return ohm;
}

async function getOhmByTrackingId(trackingId) {
  const _db = await db;
  const ohm = _db.get('ohms')
    .find({ trackingId: trackingId })
    .value()

  return ohm;
}

async function updateOhmDeliveryStatus(trackingId) {
  const _db = await db;

  const ohmObject = _db.get('ohms')
    .find({ trackingId: trackingId })
  const ohm = _db.get('ohms')
    .find({ trackingId: trackingId })
    .value()
  if (ohm) {

    // Architecture choice: DB integrity chooses current status over history. If history is more reliable then validation below will block if there's an integrity issue.
    /*
    // Error: Check history integrity with status step
    // if (ohm.status != STATUS_FLOW[ohm.history.length-1]){
    //   return "Error: There is an issue with the status tracking. Please contact the support team."
    // }
    */

    // Error: already last status, needs to be finalized by customer
    if (ohm.status == STATUS_FLOW[STATUS_FLOW.length - 1]) {
      return 
    }

    // validate current status
    if (STATUS_FLOW.indexOf(ohm.status) == -1) {
      return 
    }

    // advance status
    ohm.status = STATUS_FLOW[STATUS_FLOW.indexOf(ohm.status) + 1]

    // add to history and persist status
    ohm.history.push({
      state: ohm.status,
      at: Date.now().toString() // toString to have same format as the default
    })
    ohmObject.assign({ status: ohm.status, history: ohm.history }).write()

    return ohm; // return value depending on usage of endpoint
  }

  return
}

async function finalizeDelivery(trackingId, sentStatus, sentComment) {
  // validate correct status was sent
  const FINAL_STATUS = ['REFUSED', 'DELIVERED']
  if (FINAL_STATUS.indexOf(sentStatus) == -1) {
    return
  }

  const _db = await db;
  const ohmObject = _db.get('ohms')
    .find({ trackingId: trackingId })
  const ohm = _db.get('ohms')
    .find({ trackingId: trackingId })
    .value()

  if (ohm) {
    // check for status to be finalizable
    if (ohm.status != STATUS_FLOW[STATUS_FLOW.length - 1]) {
      return 
    }

    // check if already finalized
    if (FINAL_STATUS.indexOf(ohm.status) != -1) {
      return 
    }


    if (sentComment) {
      ohm.comment = sentComment // failure reason saved as comment. May be split into comment/reasonForFailure
    }

    // advance status
    ohm.status = sentStatus

    // add to history and persist status
    ohm.history.push({
      state: ohm.status,
      at: Date.now().toString(), // toString() to have same format as the default, performance improvement when saved as number or date type
      comment: sentComment
    })
    ohmObject.assign({
      status: ohm.status,
      history: ohm.history,
      comment: ohm.comment
    }).write()

    return ohm
  }
  return 
}


module.exports = { getOhmById, getOhmByTrackingId, updateOhmDeliveryStatus, finalizeDelivery }
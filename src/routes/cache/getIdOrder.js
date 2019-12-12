const bridge = require("../../core/managers/bridges/itemBridge")

function readRequest(req, res) {
    res.status(200).send(bridge.getIdOrder())
}

module.exports.createResponse = () => bridge.getIdOrder()
module.exports.readRequest = readRequest

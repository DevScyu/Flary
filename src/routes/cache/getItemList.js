const wynnData = require("../../core/managers/wynnData")

function readRequest(req, res) {
    res.status(200).send(wynnData.cachedItems)
}

module.exports.createResponse = () => wynnData.cachedItems
module.exports.readRequest = readRequest

const wynnData = require("../../core/managers/wynnData")

function readRequest(req, res) {
    res.status(200).send(wynnData.newItemCache)
}

module.exports.createResponse = () => wynnData.newItemCache
module.exports.readRequest = readRequest

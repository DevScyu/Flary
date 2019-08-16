const wynnData = require("../../core/managers/wynnData")

function readRequest(req, res) {
    res.status(200).send(wynnData.getTerritoryCache())
}

module.exports.createResponse = () => wynnData.getTerritoryCache()
module.exports.readRequest = readRequest

module.exports = (server, bulkRoutes) => {
    for (const key in bulkRoutes) {
        if (bulkRoutes.hasOwnProperty(key)) {
            server.get(bulkRoutes[key].route, bulkRoutes[key].module.readRequest)
        }
    }

    server.get("/bulk", (req, res) => {
        const query = req.originalUrl.match(/\?(.*)(?:#|$)/)
        if (query == null) {
            res.status(400).send({
                result: "Bad request: Missing query string",
                request: req.requestJson
            })
            return
        }
        const responseKeys = new Set()
        const unknownKeys = []
        for (const q of query[1].split("&")) {
            if (bulkRoutes.hasOwnProperty(q)) {
                responseKeys.add(q)
            } else if (q) {  // Ignore empty string
                unknownKeys.push(q)
            }
        }
        if (unknownKeys.length > 0) {
            res.status(404).send({
                result: "Not found: Unknown keys [\"" + unknownKeys.join("\", \"") + "\"]",
                request: req.requestJson
            })
            return
        }

        const responseData = {}
        for (const key of responseKeys) {
            responseData[key] = bulkRoutes[key].module.createResponse()
        }

        res.status(200).send({
            result: "Success",
            data: responseData,
            request: req.requestJson
        })
    })
}

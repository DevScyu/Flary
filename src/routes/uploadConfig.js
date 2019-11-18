const userManager = require('../core/managers/userManager');
const up = require('../core/profiles/userProfile');

function readRequest(req, res) {

	function getCorrectFiles(body) {
		var correctJsons = []
		if(!body) return []

		if(body instanceof Array) {
			body.forEach(values => {
				if(Buffer.byteLength(JSON.stringify(values)) > 100000) return //verifies if the file lenght is more than 10kbps
				if(values.base64 && values.fileName) correctJsons.push(values)
			})
		}else{
			if(Buffer.byteLength(JSON.stringify(body)) > 100000) return //verifies if the file lenght is more than 10kbps
			if(body.base64 && body.fileName) correctJsons.push(body)
		}

		return correctJsons
	}

	var filesToUpload = getCorrectFiles(req.body)
	if(filesToUpload == null || filesToUpload.length == 0) { //checks if the request is correct
		res.status(400).send({"error": "Bad Request, expecting parameters (array? fileName & base64 <= 10kb/e)"})
		return
	}

	//HeyZeer0: This checks the file size
	var response = new Object();

	var user = userManager.getUserProfileByToken(req.params.token);
	if (user == undefined) {
		response.result = 'Error! The provided user token is invalid';
	} else if (user.getAccountType() === up.AccountType.BANNED) {
		response.result = 'Error! The provided user is banned';
	} else if ((Object.keys(user.getConfigFiles()) + filesToUpload.length) > 30) {
		response.result = 'Error! The user has more than 30 uploaded files';
	} else {
		user.updateConfigFiles(filesToUpload)

		response.result = 'Success!';
	}

	response.request = req.requestJson;
	res.status(200).send(response);
}

module.exports.readRequest = readRequest;

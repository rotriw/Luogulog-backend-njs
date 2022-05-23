const axios = require("axios");
const { each } = require("cheerio/lib/api/traversing");
const { LEGAL_TCP_SOCKET_OPTIONS } = require("mongodb");

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

exports.savePagesA = async function (config) {
	return new Promise(resolve => {
		axios({
			method: 'get',
			url: config.target,
			headers: {
				"cookie": config.request.cookie,
				"user-agent": config.request.user_agent,
			}
		})
			.then(res => {
				const save = require("../save");
				resolve(res.data.data.result);
			})
			.catch(error => {
				resolve({ "info": "-", "error": error });
			});
	});
};

exports.savePages = async function (db, config, logger) {
	logger.info("Start Fetch.")
	let getData = await exports.savePagesA(config)
	const save = require("../save");
	var len_ = getData.length;
	var bf = 5;
	for (var i = 0; i < len_; i ++ ) {
		element = getData[i];
		if (config.request.fastmode == true) {
			save.update.updatePage(db, element.PostID, config, logger); await sleep(1000);}
		else await save.update.updatePage(db, element.PostID, config, logger);
	}
	logger.info("Fetched Request Ending.")
}
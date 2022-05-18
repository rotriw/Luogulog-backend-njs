const { default: axios } = require("axios");
const { time } = require("console");
const https = require("https");
const { config } = require("process");

exports.savePageCommit = async function (pageID, page, config) {
	return new Promise(resolve => {
		axios({
			method: 'get',
			url: 'http://luogu.com.cn/discuss/' + pageID + "?page=" + page,
			headers: {
				"cookie": config.request.cookie,
				"user-agent": config.request.user_agent,
			}
		})
			.then(res => {
				const deals = require("./deal");
				deals(res.data, pageID, (value) => {
					value.webstatus = res.status;
					resolve(value);
				});
			})
			.catch(error => {
				resolve({ "info": "-", "error": error });
			});
	});
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

exports.saveWholePageCommit = async function (pageID, config) {
	var i = 0;
	var now = [];
	let delayTimeError = config.time_interval.delay_time_error || 20000;
	let delayTime = config.time_interval.delay_time_normal || 500;
	var result = {
		data: [
		]
	};
	let flag = false;
	let here;
	do {
		i++;
		here = await this.savePageCommit(pageID, i, config);
		if (here.info == "0") {
			flag = true;
			await sleep(delayTimeError);
		} else {
			flag = false;
			result.data = result.data.concat(here.data);
		}
		await sleep(delayTime);
	} while (here.data.length || flag);
	return result;
};
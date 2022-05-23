const { default: axios } = require("axios");
const { time } = require("console");
const https = require("https");
const { ExplainVerbosity } = require("mongodb");
const { config } = require("process");
const { stringify } = require("querystring");

exports.getPageDescribe = async function (postID, page, config) {
	return new Promise(resolve => {
		axios({
			method: 'get',
			url: 'http://luogu.com.cn/discuss/' + postID + "?page=" + page,
			headers: {
				"cookie": config.request.cookie,
				"user-agent": config.request.user_agent,
			}
		})
			.then(res => {
				const deals = require("../deal");
				deals.getPageDescribe(res.data, postID, (value) => {
					value.webstatus = res.status;
					resolve(value);
				});
			})
			.catch(error => {
				resolve({ "info": "-", "error": error });
			});
	});
};

exports.getPageCommit = async function (postID, page, config, withTitle) {
	return new Promise(resolve => {
		axios({
			method: 'get',
			url: 'http://luogu.com.cn/discuss/' + postID + "?page=" + page,
			headers: {
				"cookie": config.request.cookie,
				"user-agent": config.request.user_agent,
			}
		})
			.then(res => {
				const deals = require("./deal");
				deals.default(res.data, postID, (value) => {
					value.webstatus = res.status;
					if (withTitle == true) {
						deals.getPageDescribe(res.data, postID, (value2) => {
							value.describe = value2;
							resolve(value);
						});
					} else {
						resolve(value);
					}
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

exports.getWholePageCommit = async function (postID, config, withTitle = false) {
	var i = 0;
	let delayTimeError = config.time_interval.delay_time_error || 20000;
	let delayTime = config.time_interval.delay_time_normal || 500;
	var result = {
		data: [
		]
	};
	let flag = false;
	let here;
	try {
		do {
			i++;
			here = await this.getPageCommit(postID, i, config, (withTitle && i == 1));
			if (here.info == "0") {
				flag = true;
				await sleep(delayTimeError);
				continue;
			} else {
				flag = false;
				result.data = result.data.concat(here.data);
			}
			if (withTitle && i == 1) {
				result.describe = here.describe;
			}
			await sleep(delayTime);
		} while (here.data.length || flag);
	} catch (err) {
		await sleep(delayTime);
		return result;
	}
	result.count = i;
	return result;
};

exports.getSomePageCommit = async function (postID, config, startPage, endPage, withTitle = false) {
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
	try {
	for (var i = startPage; i <= endPage; i++) {
		here = await this.getPageCommit(postID, i, config, (withTitle && i == 1));
		if (here.info == "0") {
			flag = true;
			await sleep(delayTimeError);
		} else {
			flag = false;
			result.data = result.data.concat(here.data);
		}
		await sleep(delayTime);
	}
} catch (err) {
	await sleep(delayTime);
	return result;
}
	result.count = i;
	return result;
};

exports.getFromPage = async function (postID, config, withTitle = false, page) {
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
	i = page - 1;	
	try {
		do {
			i++;
			here = await this.getPageCommit(postID, i, config, (withTitle && i == page));
			if (here.info == "0") {
				flag = true;
				i--;
				await sleep(delayTimeError);
				break;
			} else {
				flag = false;
				result.data = result.data.concat(here.data);
			}
			if (withTitle && i == page) {
				result.describe = here.describe;
			}
			await sleep(delayTime);
			if (typeof here.data == "string") {
				i--;
				continue;
			}
		} while (here.data.length || flag);
	} catch (err) {
		await sleep(delayTimeError);
		return await exports.getFromPage(postID, config, withTitle, page);
	}
	result.count = i;
	return result;
};
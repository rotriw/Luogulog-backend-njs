const express = require("express");
const { Logger, shutdown } = require("log4js");
const app = express();
const isNumber = require("is-number");
const { getDiscussData, getDiscussTitle } = require("../libs/show");

app.get("/", (req, res) => {
	res.json({ "info": "ok" });
});

var newsession, config;


app.get("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", config.http.access_origin);
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Content-Type', 'application/json;charset=utf-8');
	next();
})

app.get("/api/discuss/data/[0-9]{1,30}/[0-9]{1,30}", async (req, res) => {
	let PostID = /([0-9]{1,30})\/([0-9]{1,30})/g.exec(req.url);
	let result = await getDiscussData(PostID[1], newsession, config, PostID[2]);
	res.json(result);
});

app.get("/api/discuss/title/[0-9]{1,30}", async (req, res) => {
	let PostID = /([0-9]{1,30})/g.exec(req.url);
	let result = await getDiscussTitle(PostID[0], newsession, config);
	res.json(result);
});



let times = 1;

/**
 * 
 * @param {*} config 
 * @param {Logger} logger 
 */
exports.run = function (configl, logger, session) {
	let ports = configl.http.port || 3000;
	newsession = session.db;
	config = configl;
	app.listen(ports, () => {
		logger.info("Start LuoguLO Backend Service Successful. Port:" + ports);
	});
	process.on("uncaughtException", function (err) {
		logger.error(err);
		times *= 10;
		if (config.protect != true) {
			logger.off("Closed Web.");
			return;
		} else {
			logger.mark("We will restart at " + times + " seconds.");
			setTimeout(function () { exports.run(config, logger); }, times * 1000);
		}
	});
};
const express = require("express");
const { Logger, shutdown } = require("log4js");
const app = express();
const isNumber = require("is-number");
const { getDiscussData, getDiscussTitle } = require("../libs/show");
const { vertifyToken } = require("../libs/user");
const { findData } = require("../libs/search");

app.get("/", (req, res) => {
	res.json({ "info": "ok" });
});

var newsession, config;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })) 

app.all("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", config.http.access_origin);
	res.header('Access-Control-Allow-Headers', '*');
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

app.get("/api/user/luogu/start", async (req, res) => {
	const luoguv = require("../libs/luoguver")
	res.json(await luoguv.startNewLoginRequest(newsession, config))
})

app.get("/api/discussList", async (req, res) => {
	const showfb = require("../libs/showfb")
	res.json(await showfb.newList(newsession, config, 15, 0))
} )

app.post("/api/user/vertify", async (req, res) => {
	res.json(await vertifyToken(req.body.uid, req.body.token, newsession, config))
})

app.post("/api/data/find", async (req, res) => {
	console.log(req.body.q);
	res.json(await findData(req.body.q, newsession, config))
})

app.post("/api/user/luogu/vertify", async (req, res) => {
	const luoguv = require("../libs/luoguver");
	console.log(req.body)
	res.json(await luoguv.veritfyLoginRequest(req.body.pasteid, newsession, config));
	//res.json(await luoguv.veritfyLoginRequest(newsession, config));
})

let times = 1;
/**
 * 
 * @param {*} config 
 * @param {Logger} logger 
 */
exports.run = async function (config, logger, session) {
	let ports = config.http.port || 3000;
	newsession = await session.db.db(config.database.name);
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
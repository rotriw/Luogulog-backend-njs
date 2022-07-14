const save = require("./libs/save");
var log4js = require('log4js');
var loggerWeb = log4js.getLogger("Web");
loggerWeb.level = "debug";
var loggerMain = log4js.getLogger("Main");
loggerMain.level = "debug";
var loggerSave = log4js.getLogger("Save");
loggerSave.level = "debug";
const fs = require('fs');
const toml = require('toml');
const { exit } = require("process");
const database = require("./libs/database");
var args = require('minimist')(process.argv.slice(2));
let configName = args["config"];
configName === undefined ? configName = args["c"] : configName;
if (configName === undefined) {
	loggerMain.info("Can`t find right argc. We will use config.toml");
	configName = "./config.toml";
}

let datas, config;
try {
	datas = fs.readFileSync(configName, 'utf-8');
	config = toml.parse(datas);

} catch (err) {
	loggerMain.error(err);
	loggerMain.mark("report bug at https://github.com/rotriw/luogulo-backend-njs");
	loggerMain.off("OFF");
	exit(0);
}

(async () => {
	let dbsession = await database.connect(config);
	if (dbsession.info == "0") {
		loggerMain.error(dbsession.error);
		return;
	} else {
		loggerMain.info("DB Connect Sucessful.");
	}
	if (config.functions.web == true) {
		require("./module/web").run(config, loggerWeb, dbsession);
	}
	if (config.functions.autosave == true) {
		require("./module/autosave").run(config, loggerSave, dbsession.db.db(config.database.name));
	}
	//await save.insert.insertAllPage(db, 134, config);
	// save.update.updatePage(db, 4695, config);
	//await autosave.savePages(db, config);
	return;
})();

process.on("uncaughtException", function (err) {
	loggerMain.error(err);
	loggerMain.mark("report bug at https://github.com/rotriw/luogulo-backend-njs");
});
process.on("beforeExit", function () {
	loggerMain.off("OFF");
});


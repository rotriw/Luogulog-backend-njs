const { savePages } = require("../libs/autosave");

exports.run = function (config, logger, db) {
	logger.info("Autosave Start.");
	savePages(db, config, logger);
	setInterval(function () { savePages(db, config, logger); }, config.time_interval.mainpage * 1000);
}
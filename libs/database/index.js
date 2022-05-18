const mongoC = require("mongodb").MongoClient;

exports.connect = function (config) {
	return new Promise(resolve => {
		mongoC.connect(config.database.url, function (err, db) {
			if (err) {
				resolve({ "info": "0", "error": err });
			}
			return db;
		});
	});
};
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

exports.findDatainColl = function (coll, finds = {}) {
	return new Promise(resolve => {
		coll.find(finds).toArray(function (err, results) {
			if (err) {
				resolve({ "info": "0", "error": err });
				return;
			}
			resolve({ "info": "1", results });
			db.close();
		});
	});
};
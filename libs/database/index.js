const mongoC = require("mongodb").MongoClient;

exports.connect = function (config) {
	return new Promise(resolve => {
		mongoC.connect(config.database.url, function (err, db) {
			if (err) {
				resolve({ "info": "0", "error": err });
			}
			resolve({ "info": "1", "db": db });
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
		});
	});
};

exports.findDatainCollWithPage = function (coll, PostID, pages, pageN) {
	return new Promise(resolve => {
		coll.find({ "PostID": PostID }).limit(pageN).skip((pages - 1) * pageN).toArray(function (err, results) {
			if (err) {
				resolve({ "info": "0", "error": err });
				return;
			}
			resolve({ "info": "1", results });
		});
	});
};

exports.getStatus = async function (coll) {
	return coll.count();
}
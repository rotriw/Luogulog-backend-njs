const { findDatainColl } = require("../database");
const deals = require("./deal");
const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} db
 * @summary 对一整个帖子进行爬
 */
exports.insertAllPage = async function (db, postID, config) {
	var dbo = db.db(config.database.name);
	let val = await deals.getWholePageCommit(postID, config, true);
	let collDiscuss = dbo.collection("discuss");
	let collCommit = dbo.collection("commit");
	if (val.info == "0" || val.describe.info == "0") { // title get error
		if (val.info == "0") {
			return { "info": "0", "error": val.error };
		}
		return { "info": "0", "error": val.error };
	}
	val.describe.data.pages = val.count;
	collDiscuss.insertOne(val.describe.data);
	if (val.data.length > 0) {
		collCommit.insertMany(val.data);
	}
};

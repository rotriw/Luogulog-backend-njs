const save = require("../save");
const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} db
 */
exports.updatePage = async function (db, pageID, config) {
	var dbo = db.db(config.database.config);
	var coll = dbo.collection("commit");

};
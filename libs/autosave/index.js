const { findDatainColl } = require("../database");
const save = require("../save");
const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} db
 */
exports.updatePage = async function (db, postID, config) {
	var dbo = db.db(config.database.name);
	var coll = dbo.collection("discuss");
	let findResult = findDatainColl(coll, { "postid": postID });
	console.log(findResult);
};
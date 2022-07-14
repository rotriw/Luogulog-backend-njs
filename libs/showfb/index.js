const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} db
 * @summary NewList
 */
exports.newList = async function (db, config, list, skip) {
	let result = [];
	let dbs = db;
	let Ccoll = await dbs.collection("discuss");
	result = await Ccoll.find({}).skip(skip).limit(list).toArray();
	return result;
}
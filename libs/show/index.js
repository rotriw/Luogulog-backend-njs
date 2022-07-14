const { findDatainCollWithPage, findDatainColl } = require("../database");


const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} session
 */
exports.getDiscussData = async function (postID, db, config, page) {
	var dbo = db;
	var coll = dbo.collection("commit");
	var pID = parseInt(postID);
	return await findDatainCollWithPage(coll, pID, page, 10);
};


/**
 * @param {mongoC} session
 */
exports.getDiscussTitle = async function (postID, db, config) {
	var dbo = db;
	var coll = dbo.collection("discuss");
	var pID = parseInt(postID);
	let results = await coll.findOne({ "postID": pID });
	return results;
};

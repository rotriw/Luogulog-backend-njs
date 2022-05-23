const { findDatainCollWithPage, findDatainColl } = require("../database");

/**
 * @param {mongoC} session
 */
exports.getDiscussData = async function (postID, db, config, page) {
	var dbo = db.db(config.database.name);
	var coll = dbo.collection("commit");
	var pID = parseInt(postID);
	return await findDatainCollWithPage(coll, pID, page, 10);
};

exports.getDiscussTitle = async function (postID, db, config) {
	var dbo = db.db(config.database.name);
	var coll = dbo.collection("discuss");
	var pID = parseInt(postID);
	let results = await findDatainColl(coll, { "postID": pID });
	return results.results[0];
}
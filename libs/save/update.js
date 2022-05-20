const { findDatainColl } = require("../database");
const save = require("./deal");
const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} db
 */
exports.updatePage = async function (db, postID, config) {
	var dbo = db.db(config.database.name);
	var Ccoll = dbo.collection("commit");
	let findResult = await Ccoll.find({ "PostID": postID }).sort({ sendTime: -1 }).limit(10).toArray();
	// 先来找找最后评论在哪里
	var Dcoll = dbo.collection("discuss");
	let findResult2 = await Dcoll.findOne({ "postID": postID });
	console.log(findResult2);
	let lastCommitPage = findResult2.pages;
	let flag = false;
	let last5PageCommit = await save.getSomePageCommit(postID, config, Math.max(lastCommitPage - 6, 1), lastCommitPage);
	var i = -1, endi = findResult.length;
	let ts = last5PageCommit.data;
	let len_ = last5PageCommit.length;
	console.log(ts);
	do {
		i++;
		let WantFind = findResult[i];
		for (let _i = 0; _i < len_; _i++) {
			if (ts[_i].sendTime == WantFind.sendTime && ts[_i].content == WantFind.content && ts[_i].authorID == WantFind.authorID) {
				flag = true;
				break;
			}
		}
	} while (i == endi - 1 && flag == false);
	let newPageData = {};
	if (flag == false) { // 说明五页内啥也没有
		// 直接从提前10页的位置
		newPageData = await save.getFromPage(postID, config, true, Math.max(lastCommitPage - 11, 1));
	} else { // 说明五页内有，但是懒得找到底是哪页捏，我也不知道
		newPageData = await save.getFromPage(postID, config, true, Math.max(lastCommitPage - 6, 1));
	}
	let oldData = await Ccoll.find({ "PostID": postID }).toArray();
	let len_2 = newPageData.data.length;
	let cnt2 = oldData.length;
	let cnt3 = 0;
	let newUpdate = [];
	console.log(oldData);
	console.log("awa");
	console.log(newPageData);
	console.log("awa");
	for (let i = 0; i < len_2; i++) {
		let flag2 = false;
		for (let j_ = 0; j_ < cnt2; j_++) {
			if (newPageData.data[i].sendTime == oldData[j_].sendTime && newPageData.data[i].authorID == oldData[j_].authorID && newPageData.data[i].PostID == oldData[j_].PostID && newPageData.data[i].content == oldData[j_].content) {
				flag2 = true;
				break;
			}
		}
		if (flag2 == false) {
			newUpdate[i] = newPageData.data[i];
		}
	}
	//	console.log(newPageData.count);
	//	console.log(oldData.describe);
	//	console.log("asdfafasdfasdfasd\n");
	//	console.log(newUpdate);
	newPageData.describe.data.pages = newPageData.count;
	try {
		await Dcoll.replaceOne({ "postID": postID }, newPageData.describe.data);
		await Ccoll.insertMany(newUpdate);
	} catch (err) {
		return { "info": "0", "error": err };
	}
	return { "info": "1" };
};
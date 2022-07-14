const { findDatainColl } = require("../database");
const save = require("./deal");
const { insertAllPage } = require("./insert");
const mongoC = require("mongodb").MongoClient;


exports.updatePage = async function (db, postID, config, logger) {
	logger.info("Start Fetch " + postID);
	
	var dbo = db;
	// 先来找找最后评论在哪里
	var Dcoll = dbo.collection("discuss");
	
	let findResult2 = await Dcoll.findOne({ "postID": postID });
	
	//(existJudge);
	//console.log("wow");
	if (findResult2 == null) {
		await insertAllPage(db, postID, config);
		logger.info("End Fetch With new insert " + postID);
		return;
	}
	//console.log("2");
	var Ccoll = dbo.collection("commit");
	let findResult = await Ccoll.find({ "PostID": postID }).sort({ sendTime: -1 }).limit(10).toArray();
	//console.log(findResult2);
	let lastCommitPage = findResult2.pages || 1;
	let flag = false;
	let last5PageCommit = await save.getSomePageCommit(postID, config, Math.max(lastCommitPage - 2, 1), lastCommitPage);

	var i = -1, endi = findResult.length;
	let ts = last5PageCommit.data;
	let len_ = last5PageCommit.data.length;

//	console.log("2");
	do {
		i++;
		let WantFind = findResult[i];
		if (WantFind === undefined) {
			break;
		}
		for (let _i = 0; _i < len_; _i++) {
			if (ts[_i].sendTime == WantFind.sendTime && ts[_i].content == WantFind.content && ts[_i].authorID == WantFind.authorID) {
				flag = true;
				break;
			}
		}
	} while (i < endi - 1 && flag == false);

//	console.log("2");

	let newPageData = {};
	if (flag == false) { // 说明五页内啥也没有
		// 直接从提前10页的位置
		newPageData = await save.getFromPage(postID, config, true, Math.max(lastCommitPage - 5, 1));
	} else { // 说明五页内有，但是懒得找到底是哪页捏，所以我也不知道。
		newPageData = await save.getFromPage(postID, config, true, lastCommitPage + 1);
		newPageData.data = last5PageCommit.data.concat(newPageData.data);
	}
//	console.log("2");
	
	let oldData = await Ccoll.find({ "PostID": postID }).toArray();

	let len_2 = newPageData.data.length;
	let cnt2 = oldData.length;
	let cnt3 = 0;
	let newUpdate = [];
	for (let i = 0; i < len_2; i++) {
		let flag2 = false;
		if (newPageData.data[i] == undefined) {
			continue;
		}
		for (let j_ = 0; j_ < cnt2; j_++) {
			if (newPageData.data[i].sendTime == oldData[j_].sendTime && newPageData.data[i].authorID == oldData[j_].authorID && newPageData.data[i].PostID == oldData[j_].PostID && newPageData.data[i].content == oldData[j_].content) {
				flag2 = true;
				break;
			}
		}
		if (flag2 == false) {
			newUpdate[cnt3++] = newPageData.data[i];
		}
	}
	try {
		newPageData.describe.data.pages = newPageData.count;
		await Dcoll.replaceOne({ "postID": postID }, newPageData.describe.data);
		if (newUpdate.length > 0 && newUpdate != null) {
			await Ccoll.insertMany(newUpdate);
		}
	} catch (err) {
		logger.error("Failed Update data " + postID + err + "\n");
		return { "info": "0", "error": err };
	}

	logger.info("End Fetch " + postID);
	return { "info": "1" };
};
const axios = require("axios");
/**
 * @param {require('mongodb').session} db
 */
exports.startNewLoginRequest = async function (db, config) {
	let dbs = db;
	let coll = await dbs.collection("userluoguv");
	const { v4: uuidv4 } = require('uuid');
	let strUUID = uuidv4() + uuidv4();
	let strUUID2 = strUUID.replace(/-/g, '');
	let nowTime = Date.now();
	coll.insertOne({
		"id": strUUID2,
		"time": nowTime
	});
	console.log(strUUID2);
	return {
		"id": strUUID2
	}
};

async function dealsDataWithLuogu(pasteData, userUID, db, config, callback) {
	let dbs = db;
	let coll = await dbs.collection("userluoguv");
	let dbData = await coll.findOne({ "id": pasteData });
	if (dbData == undefined) {
		callback({
			"msg": "无法在数据库中找到相关数据,请检验是否存在。"
		})
		return;
	} else if (Date.now() - dbData.time > 600000) {
		callback({
			"msg": "超时验证。"
		})
		return;
	} else {
		console.log(userUID);
		const { v4: uuidv4 } = require('uuid');
		let strUUID = uuidv4() + uuidv4();
		let newToken = strUUID.replace(/-/g, '');
		let Ccoll = dbs.collection("usertoken");
		coll.replaceOne({ "id": pasteData }, {
			time: -11451419
		})
		Ccoll.insertOne({
			"uid": userUID,
			"token": newToken,
			"time": Date.now()
		})
		callback({
			"msg": "验证通过。",
			"user": userUID,
			"token": newToken
		})
		return;
	}
}

exports.veritfyLoginRequest = async function (pasteID, db, config) {
	console.log("2333");
	return new Promise(resolve => {
		axios({
			method: 'get',
			url: 'http://luogu.com.cn/paste/' + pasteID,
			headers: {
				"x-luogu-type": "content-only",
				"user-agent": config.request.user_agent,
			}
		}).then(res => {
			console.log(res.data)
			if (res.data.code == 404) {
				resolve({
					"msg": "您所验证的剪切板不存在！"
				})
			}
			dealsDataWithLuogu(res.data.currentData.paste.data, res.data.currentData.paste.user.uid, db, config, (value)=>{
				resolve(value)
			})
		})
	})
}
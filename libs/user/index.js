exports.vertifyToken = async function (userid, token, db, config) {
	let dbs = db.db(config.database.name);
	let coll = await dbs.collection("usertoken");
	let dbData = await coll.findOne({ "token": token });
	if (dbData == undefined) {
		return {
			"status": "info",
			"msg": "can`t find token"
		}
	}
	if (dbData.time < 0) {
		return {
			"status": "error",
			"msg": "已失效token!"
		}
	}
	console.log(dbData.uid + "-" + userid)
	if (dbData.uid != userid) {
		return {
			"status": "error",
			"msg": "判断uid和数据库内所存数据不匹配!"
		}
	}
	return {
		"status": "success",
		"msg": "通过。"
	}
}
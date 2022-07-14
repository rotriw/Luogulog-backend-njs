const mongoC = require("mongodb").MongoClient;

/**
 * @param {mongoC} db
 * @summary findData
 */
exports.findData = async function (data, db, config) {
	let dbs = db;
	let Dcoll = await dbs.collection("commit");
	let Ccoll = await dbs.collection("discuss");
	//先找discuss标题
	let res = await Ccoll.find({ "authorName": { $regex: data, $options: 'i' } }).limit(15).toArray()
	if (res == undefined) {
		res = [];
	}
	res = res.concat(await Ccoll.find({ "title": { $regex: data, $options: 'i' } }).limit(15).toArray());
	return res;
};

exports.findDataAccurate = async function (data, db, config) {
	let dbs = db;
	let Dcoll = await dbs.collection("commit");
	let Ccoll = await dbs.collection("discuss");
	let getValue = data.number;
	let res = [];
	//TODO
}
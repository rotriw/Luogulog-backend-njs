exports.default = async function (domString, postID, callback) {
	let discussCommit = [];
	let $ = require("cheerio").load(domString);
	let _i = 0;
	$(".am-comment-meta").each(function (idx, el) {
		if (_i == 0) {
			_i++;
			return;
		}
		discussCommit[_i - 1] = {};
		discussCommit[_i - 1].PostID = postID;
		discussCommit[_i - 1].authorID = $(el).find("a").first().attr("href").slice(6);
		discussCommit[_i - 1].authorName = $(el).find("a").first().text();
		let timeh = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec($(el).text());
		discussCommit[_i - 1].sendTime = new Date(timeh[0]).getTime();
		_i++;
	});
	_i = 0;
	$(".am-comment-bd").each(function (idx, el) {
		if (_i == 0) {
			_i++;
			return;
		}
		if (discussCommit[_i - 1] === undefined) {
			discussCommit[_i - 1] = {};
		}
		discussCommit[_i - 1].content = $(el).html();
		_i++;
	});
	callback({
		"info": "1",
		"data": discussCommit
	});
	return;
};

exports.getPageDescribe = async function (domString, postID, callback) {
	let discussD = {
		postID: postID
	};
	let $ = require("cheerio").load(domString);
	let _i = 0;
	let tl = $(".am-comment-meta").first();
	discussD.title = $("h1").first().text();
	discussD.authorID = tl.find("a").first().attr("href").slice(6);
	discussD.authorName = tl.find("a").first().text();
	let timeh = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/.exec(tl.text());
	discussD.sendTime = new Date(timeh[0]).getTime();
	_i = 0;
	discussD.content = $(".am-comment-bd").first().html();
	callback({
		"info": "1",
		"data": discussD
	});
	return;
};
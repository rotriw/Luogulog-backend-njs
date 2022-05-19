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
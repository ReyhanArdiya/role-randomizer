//@ts-check
"use strict";

const extraButtons = document.querySelectorAll("#area-result > footer button");

const copyToClipboardButton = {
	resultAnnouncement: "",
	makeResultAnnouncement: function (explanationStr = "role is") {
		let joinedAnnouncement = inputData.results.map(function (/** @type {[]} */ memberAndRoleArr) {
			return memberAndRoleArr.join(` ${explanationStr} `);
		});
		console.log(joinedAnnouncement);
	},
	copyToClipBoard: function (resultAnnouncement) {
		navigator.clipboard.writeText(resultAnnouncement);
	}
};
/** Example announcement, each member is in their own line
 * Adam role is makalah
 * Bea role is ppt
 * member role is role
 * results[0] role is results[1]
 */
// syntax: "1\n2\n3\n4" where \n is a new linebreak

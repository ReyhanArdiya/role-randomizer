//@ts-check
"use strict";

const extraButtons = document.querySelectorAll("#area-result > footer button");

const copyToClipboardButton = {
	resultsAnnouncement: "",
	makeResultsAnnouncement: function (explanationStr = "role is") {
		const joinedAnnouncement = inputData.results.map(function (/** @type {[]} */ memberAndRoleArr) {
			return memberAndRoleArr.join(` ${explanationStr} `);
		});
		copyToClipboardButton.resultsAnnouncement = joinedAnnouncement.join("\n");
	},
	copyToClipBoard: function (resultsAnnouncement) {
		navigator.clipboard.writeText(resultsAnnouncement);
	},
	copyToClipboardHandler: function () {
		copyToClipboardButton.makeResultsAnnouncement();
		copyToClipboardButton.copyToClipBoard(copyToClipboardButton.resultsAnnouncement);
	}
};

extraButtons[0].addEventListener("click", copyToClipboardButton.copyToClipboardHandler, false);

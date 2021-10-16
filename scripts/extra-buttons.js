//@ts-check
"use strict";

const extraButtons = document.querySelectorAll("#area-result > footer button");

// #region copy to clipboard button

const copyToClipboardButton = {
	resultsAnnouncement: "",
	// FIXME this works, but we should make the results based on the CURRENT TABLE BEING DISPLAYED IN THE ROLES AREA  so that it can copy based on the sorting position. This one doesn't copy based on the sort positions
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

// #endregion copy to clipboard button

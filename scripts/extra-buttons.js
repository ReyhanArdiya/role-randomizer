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
	}
};

extraButtons[0].addEventListener(
	"click",
	function () {
		copyToClipboardButton.makeResultsAnnouncement();
		copyToClipboardButton.copyToClipBoard(copyToClipboardButton.resultsAnnouncement);
	},
	false
);

// #endregion copy to clipboard button

// #region retry button

extraButtons[1].addEventListener(
	"click",
	function () {
		randomizerEngine.displayResults();
		addSortToButtons();
	},
	false
);

// #endregion retry button

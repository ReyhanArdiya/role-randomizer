"use strict";

/**
 * Contains NodeList of the 3 buttons in the results area
 * @type {NodeListOf<HTMLButtonElement>}
 * @property {HTMLButtonElement} 0 - copy to clipboard button
 * @property {HTMLButtonElement} 1 - retry button
 * @property {HTMLButtonElement} 2 - restart button
 */
const extraButtons = document.querySelectorAll("#area-result > footer button");

// #region copy to clipboard button

/**
 * Object to handle copying to user's clipboard.
 */
const copyToClipboardButton = {
	/**
	 * String of the randomizing results assigned by {@link copyToClipboardButton.makeResultsAnnouncement}.
	 * @type {string}
	 */
	resultsAnnouncement: "",
	// FIXME this works, but we should make the results based on the CURRENT TABLE BEING DISPLAYED IN THE ROLES AREA  so that it can copy based on the sorting position. This one doesn't copy based on the sort positions
	/**
	 * Method to make the results announcement and assign it to {@link copyToClipboardButton.resultsAnnouncement}.
	 * @param {string} [explanationStr="role is"] - A string that will be used in the middle of the concatenated strings.
	 */
	makeResultsAnnouncement: function (explanationStr = "role is") {
		// @ts-ignore
		const joinedAnnouncement = inputData.results?.map(function (/** @type {[string, string]} */ memberAndRoleArr) {
			return memberAndRoleArr?.join(` ${explanationStr} `);
		});
		copyToClipboardButton.resultsAnnouncement = /**@type {string}*/ (joinedAnnouncement?.join("\n"));
	},
	/**
	 * Method to copy a string to the user's clipboard.
	 * @param {string} resultsAnnouncement - A string that will be coppied, usually is taken from {@link copyToClipboardButton.resultsAnnouncement}.
	 */
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

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
	/**
	 * Method to make the results announcement and assign it to {@link copyToClipboardButton.resultsAnnouncement}.
	 * @param {string} [explanationStr="role is"] - A string that will be used in the middle of the concatenated strings.
	 */
	makeResultsAnnouncement: function (explanationStr = "role is") {
		/**
		 * @param {number} col
		 * @returns {string[]}
		 */
		const getResultsTdTexts = col => {
			// @ts-ignore
			return [...document.querySelectorAll(`#randomized-table td:nth-of-type(${col})`)].map(td => td.innerText);
		};
		const membersTd = getResultsTdTexts(1);
		const rolesTd = getResultsTdTexts(2);
		/**@type {string[]}*/
		const joinedAnnouncement = [];
		for (let i = 0; i < membersTd.length; i++) {
			let currentMember = membersTd[i];
			joinedAnnouncement.push(
				`${currentMember}${(() => (currentMember[currentMember.length - 1].toLowerCase() === "s" ? "'" : "'s"))()} ${explanationStr} ${
					rolesTd[i]
				}`
			);
		}
		joinedAnnouncement.push("\nRandomized from https://reyhanardiya.github.io/role-randomizer/");
		copyToClipboardButton.resultsAnnouncement = /**@type {string}*/ (joinedAnnouncement?.join("\n"));
	},
	/**
	 * Method to copy a string to the user's clipboard.
	 * @param {string} resultsAnnouncement - A string that will be coppied, usually is taken from {@link copyToClipboardButton.resultsAnnouncement}.
	 */
	copyToClipBoard: function (resultsAnnouncement) {
		navigator.clipboard.writeText(resultsAnnouncement);
		buttonOpc(/**@type {HTMLSpanElement}*/ (document.querySelector("#copy-popup")), "show");
		setTimeout(function () {
			buttonOpc(/**@type {HTMLSpanElement}*/ (document.querySelector("#copy-popup")), "hide");
		}, 1000);
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

// #region restart button

/**
 * Function to clear the value from any input elements.
 * @param {HTMLInputElement} inputEl
 * @returns {void}
 */
function clearInputs(inputEl) {
	inputEl.value = "";
}

extraButtons[2].addEventListener(
	"click",
	function () {
		areaNodes[1].scrollIntoView(true);
		for (let membersInput of /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.membersInputsElCol)) {
			clearInputs(membersInput);
		}
		for (let rolesInput of /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.rolesInputsElCol)) {
			clearInputs(rolesInput);
		}
		for (let quotaInput of /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.quotaInputsElCol)) {
			clearInputs(quotaInput);
		}
		resize(/**@type {HTMLElement}*/ (document.querySelector("#results-container")), "shrink");
		/* Append the results button back because it was removed when the results button is click */
		document.querySelector("#results-container")?.prepend(resultsButton);
		buttonOpc(resultsButton, "show");
		/* These three is used to clear the values in inputData.members/quota/roles */
		inputData.getMembersInput();
		inputData.getQuotaInput();
		inputData.getRolesInput();
		/* Reset the counter back to 0 */
		inputTracker.trackMembersTotal();
		/* Reset the counter back to 0 in the HTML. So far this is the way that I found to do this because I can't just use the trackQuotaTotal because it can't reduce an empty array to 0. */
		inputTracker.counters[1].innerText = "0";
		for (let extraButton of extraButtons) {
			buttonOpc(extraButton, "hide");
		}
	},
	false
);

// #endregion restart button

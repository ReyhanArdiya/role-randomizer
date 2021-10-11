//@ts-check
"use strict";

/**@type {HTMLButtonElement}*/
const resultsButton = document.querySelector("#results-button");

/**
 * @param {HTMLElement} growArea
 * @param {string} status
 */
function resize(growArea, status) {
	status === "grow" ? growArea.classList.add("results-clicked") : growArea.classList.remove("results-clicked");
}

/**
 * @param {HTMLButtonElement} resultsButton
 * @param {string} status
 */
function buttonOpc(resultsButton, status) {
	status === "show" ? resultsButton.classList.remove("results-button-invisible") : resultsButton.classList.add("results-button-invisible");
}

resultsButton.addEventListener(
	"click",
	function () {
		resize(document.querySelector("#results-container"), "grow");
		buttonOpc(resultsButton, "invisible");
		inputData.membersInput = inputData.getInputs("#heading-members", 1);
		inputData.rolesInput = inputData.getInputs("#heading-roles", 1);
		inputData.quotaInput = inputData.getInputs("#heading-roles", 2).map(function (str) {
			return ~~str;
		});
		inputData.rolesCollection = inputData.makeRolesCollection(inputData.rolesInput, inputData.quotaInput, inputData.quotaInput.length);
		inputData.randomizeProps();
		const resultsTable = document.querySelector("#results-table");
		resultsTable.removeChild(resultsTable.children[0]);
		resultsTable.appendChild(makeResultsTable(randomizer(inputData.membersInput, inputData.rolesCollection)));
	},
	false
);

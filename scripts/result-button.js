//@ts-check
"use strict";

document.querySelector("#results-button").addEventListener(
	"click",
	function () {
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

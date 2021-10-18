"use strict";

/**
 * Function to make the results table.
 * @param {[string, string]} tableData - array of arrays where the array items is made of [name, role] usually returned by {@link randomizer}.
 * @returns {HTMLTableElement} Table node of results table that can be appended later.
 */
function makeResultsTable(tableData) {
	const table = document.createElement("table");
	const tbody = document.createElement("tbody");
	for (let result of tableData) {
		const row = document.createElement("tr");
		const memberCell = document.createElement("td");
		memberCell.innerText = result[0];
		row.appendChild(memberCell);
		const roleCell = document.createElement("td");
		roleCell.innerText = result[1];
		row.appendChild(roleCell);
		tbody.appendChild(row);
	}
	table.appendChild(tbody);
	table.id = "randomized-table";
	return table;
}

/**
 * Object that stores properties and methods of the popup warning element.
 */
const warningPopup = {
	/**
	 * The node for the pop up overlay (the dark area around the content); will be set by {@link warningPopup.insertPopup}.
	 * @type {HTMLElement | null}
	 */
	popUpOverlay: null,
	/**
	 * The node for the pop up content; will be set by {@link warningPopup.insertPopup}.
	 * @type {HTMLElement | null}
	 */
	popUpContent: null,
	/**
	 * Method to insert the popup to the document.
	 * @returns {void}
	 */
	insertPopup: function () {
		document.body.appendChild(/**@type {HTMLTemplateElement}*/ (document.querySelector("#invalid-warning"))?.content.cloneNode(true));
		warningPopup.popUpOverlay = document.querySelector("#invalid-warning-overlay");
		warningPopup.popUpContent = document.querySelector("#invalid-warning-content");
		setTimeout(function () {
			/**@type {HTMLElement}*/ (warningPopup.popUpContent).className = "popup-show";
		}, 200);
		document.querySelector("#invalid-warning-overlay button")?.addEventListener("click", warningPopup.removePopup, false);
		areaNodes[1].scrollIntoView(true);
	},
	/**
	 * Method to remove the popup from the document.
	 * @returns {void}
	 */
	removePopup: function () {
		/**@type {HTMLElement}*/ (warningPopup.popUpContent).className = "";
		setTimeout(function () {
			/**@type {HTMLElement}*/ (warningPopup.popUpOverlay).remove();
		}, 200);
	}
};

/**
 * Object that contains methods for handling randomizing the inputs.
 */
const randomizerEngine = {
	/**
	 * Method to display the results in #results-container.
	 */
	displayResults: function () {
		inputData.rolesCollection = inputData.makeRolesCollection(
			/**@type {String[]}*/ (inputData.rolesInput),
			/**@type {number[]}*/ (inputData.quotaInput),
			/**@type {number[]}*/ (inputData.quotaInput).length
		);
		inputData.randomizeProps();
		const resultsTable = /**@type {HTMLTableElement}*/ (document.querySelector("#results-table"));
		resultsTable.removeChild(resultsTable.children[0]);
		inputData.results = randomizerEngine.resultsRandomizer(/**@type {string[]}*/ (inputData.membersInput), inputData.rolesCollection);
		resultsTable.appendChild(makeResultsTable(inputData.results));
	},
	/**
	 * Method to randomize the inputs; this is the main engine of the logic.
	 * @param {string[]} membersList - List of members in the form of string array, usually taken from {@link inputData.membersInput}.
	 * @param {RolesObj[]} rolesList - List of roles in the form of {@link RolesObj} array, usually taken from {@link inputData.rolesCollection}.
	 * @returns {[...[string, string]]} An array filled with string arrays of [memberName, roleName].
	 */
	resultsRandomizer: function (membersList, rolesList) {
		/**
		 * Array to store members that are already assigned to a role.
		 * @type {string[]}
		 */
		const assignedMembers = [];
		/**
		 * Array to store the Roles object whose quota is full based on Roles.members.length === Roles.quota.
		 * @type {RolesObj[]}
		 */
		const fullRoles = [];
		/**
		 * Array of string arrays to store the randomizing results.
		 * @type {[...[string,string]] | []}
		 */
		const results = [];
		let chosenMember;
		let chosenRole;
		let membersIterated = 0;
		while (membersIterated < membersList.length) {
			while (true) {
				chosenMember = membersList[Math.floor(Math.random() * membersList.length)];
				chosenRole = rolesList[Math.floor(Math.random() * rolesList.length)];
				if (!assignedMembers.includes(chosenMember) && !fullRoles.includes(chosenRole)) {
					break;
				}
			}
			if (chosenRole.members.length === chosenRole.quota) {
				fullRoles.push(chosenRole);
			} else {
				assignedMembers.push(chosenMember);
				chosenRole.members.push(chosenMember);
				// @ts-ignore
				results.push([chosenMember, chosenRole.roleName]);
				membersIterated++;
			}
		}
		// @ts-ignore
		return results;
	}
};

// #region results button

/**@type {HTMLButtonElement}*/
const resultsButton = /**@type {HTMLButtonElement}*/ (document.querySelector("#results-button"));
const resultFooterButtons = document.querySelectorAll("#area-result footer button");

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
		if (inputValidity.isTotalSame && inputValidity.isRoleInputsValid) {
			resize(/**@type {HTMLElement}*/ (document.querySelector("#results-container")), "grow");
			buttonOpc(resultsButton, "invisible");
			for (let footButton of resultFooterButtons) {
				// @ts-ignore
				buttonOpc(footButton, "show");
			}
			randomizerEngine.displayResults();
			addSortToButtons();
			setTimeout(function () {
				resultsButton.remove();
			}, 500);
		} else {
			warningPopup.insertPopup();
		}
	},
	false
);

// #endregion result button

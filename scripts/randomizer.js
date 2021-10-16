//@ts-check
"use strict";

// #region table maker

/**
 * @param {any[][]} tableData - array of arrays where the array items is made of [name, role] usually returned by {@link randomizer}
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

// #endregion table maker

// #region warning popup

const warningPopup = {
	/**@type {HTMLElement}*/
	popUpOverlay: null,
	/**@type {HTMLElement}*/
	popUpContent: null,
	insertPopup: function () {
		// @ts-ignore
		document.body.appendChild(document.querySelector("#invalid-warning").content.cloneNode(true));
		warningPopup.popUpOverlay = document.querySelector("#invalid-warning-overlay");
		warningPopup.popUpContent = document.querySelector("#invalid-warning-content");
		setTimeout(function () {
			warningPopup.popUpContent.className = "popup-show";
		}, 200);
		document.querySelector("#invalid-warning-overlay button").addEventListener("click", warningPopup.removePopup, false);
		areaNodes[1].scrollIntoView(true);
	},
	removePopup: function () {
		warningPopup.popUpContent.className = "";
		setTimeout(function () {
			warningPopup.popUpOverlay.remove();
		}, 200);
	}
};

// #endregion warning popup

// #region randomizer logic

/**
 * @param {string[]} membersList
 * @param {object[]} rolesList
 */
function randomizer(membersList, rolesList) {
	const assignedMembers = [];
	const fullRoles = [];
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
			results.push([chosenMember, chosenRole.roleName]);
			membersIterated++;
		}
	}
	return results;
}

// #endregion randomizer logic

// #region results button

/**@type {HTMLButtonElement}*/
const resultsButton = document.querySelector("#results-button");
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
			resize(document.querySelector("#results-container"), "grow");
			buttonOpc(resultsButton, "invisible");
			for (let footButton of resultFooterButtons) {
				// @ts-ignore
				buttonOpc(footButton, "show");
			}
			inputData.rolesCollection = inputData.makeRolesCollection(inputData.rolesInput, inputData.quotaInput, inputData.quotaInput.length);
			inputData.randomizeProps();
			const resultsTable = document.querySelector("#results-table");
			resultsTable.removeChild(resultsTable.children[0]);
			inputData.results = randomizer(inputData.membersInput, inputData.rolesCollection);
			resultsTable.appendChild(makeResultsTable(inputData.results));
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

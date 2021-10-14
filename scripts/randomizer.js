//@ts-check
"use strict";

// #region input data

const inputData = {
	membersInput: null,
	rolesInput: null,
	quotaInput: null,
	rolesCollection: null,
	getInputs: function (inputTableQuery, tdColumn) {
		return [...document.querySelectorAll(`${inputTableQuery} table td:nth-of-type(${tdColumn})`)]
			.map(function (el) {
				// @ts-ignore
				return el.firstElementChild.value;
			})
			.filter(function (str) {
				return str !== "";
			});
	},
	makeRolesCollection: function (roleNameArr, quotaArr, totalRoles) {
		const rolesArr = [];
		for (let i = 0; i < totalRoles; i++) {
			rolesArr.push(new Roles(roleNameArr[i], quotaArr[i]));
		}
		return rolesArr;
	},
	/**
	 * @this inputData
	 */
	randomizeProps: function () {
		randomizeArr(inputData.membersInput);
		randomizeArr(this.rolesCollection);
	},
	cologData: function () {
		console.table(this.rolesCollection);
		console.table([this.rolesInput, this.quotaInput]);
		console.table(this.membersInput);
	}
};

/**
 * Randomize the items index in the original array and return the reference value to the original array
 * @param {any[]} arr
 */
function randomizeArr(arr) {
	return arr.sort(function () {
		return [-1, 1][Math.floor(Math.random() * 2)];
	});
}

function Roles(roleName, quota) {
	this.roleName = roleName;
	this.quota = quota;
	this.members = [];
}

// #endregion input data

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
		resize(document.querySelector("#results-container"), "grow");
		buttonOpc(resultsButton, "invisible");
		for (let footButton of resultFooterButtons) {
			// @ts-ignore
			buttonOpc(footButton, "show");
		}
	},
	false
);

resultsButton.addEventListener(
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
		addSortToButtons();
		setTimeout(function () {
			resultsButton.remove();
		}, 500);
	},
	false
);

// #endregion result button

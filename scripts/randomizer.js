//@ts-check
"use strict";

// #region get input data

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

const inputData = {
	membersInput: null,
	rolesInput: null,
	quotaInput: null,
	getInputs: function (inputTableQuery, tdColumn) {
		return [...document.querySelectorAll(inputTableQuery + " table td:nth-of-type(" + tdColumn + ")")]
			.map(function (el) {
				// @ts-ignore
				return el.firstElementChild.value;
			})
			.filter(function (str) {
				return str !== "";
			});
	},
	rolesCollection: null,
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
// Get inputs and set it to inputData properties
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

// #endregion get input data

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

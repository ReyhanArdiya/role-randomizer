//@ts-check
"use strict";

const inputData = {
	membersInput: null,
	rolesInput: null,
	quotaInput: null,
	rolesCollection: null,
	getInputs: function (inputTableQuery, tdColumn) {
		let inputArr = [...document.querySelectorAll(`${inputTableQuery} table td:nth-of-type(${tdColumn})`)]
			.map(function (el) {
				// @ts-ignore
				return el.firstElementChild.value;
			})
			.filter(function (str) {
				return str !== "";
			});
		inputArr.forEach(function (str, i, arr) {
			arr[i] = str.trim();
		});
		return inputArr;
	},
	getMembersInput: function () {
		inputData.membersInput = inputData.getInputs("#heading-members", 1);
	},
	getRolesInput: function () {
		inputData.rolesInput = inputData.getInputs("#heading-roles", 1);
	},
	getQuotaInput: function () {
		inputData.quotaInput = inputData.getInputs("#heading-roles", 2).map(function (str) {
			return ~~str;
		});
	},
	makeRolesCollection: function (/** @type {any[]} */ roleNameArr, /** @type {any[]} */ quotaArr, /** @type {number} */ totalRoles) {
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

const inputRows = {
	addMoreButtons: document.querySelectorAll(".add-more-button"),
	inputTemplates: document.querySelectorAll("template"),
	membersInputsElCol: document.querySelector("#heading-members table").getElementsByTagName("input"),
	quotaInputsElCol: document.getElementsByClassName("input-quota"),
	addRows: function (/** @type {number} */ whichTemplate, /** @type {string} */ whichInputTable) {
		const content = this.inputTemplates[whichTemplate].content;
		return function () {
			const clone = content.cloneNode(true);
			document.querySelector(whichInputTable + " tbody").appendChild(clone);
		};
	}
};

const inputTracker = {
	counters: document.querySelectorAll(".counter-number")
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
// TODO put this and other roles stuff in inputData inside of its own object
function Roles(roleName, quota) {
	this.roleName = roleName;
	this.quota = quota;
	this.members = [];
}

for (let i = 0; i < inputRows.addMoreButtons.length; i++) {
	inputRows.addMoreButtons[i].addEventListener("click", inputRows.addRows(0, "#heading-members"), false);
	inputRows.addMoreButtons[i].addEventListener("click", inputRows.addRows(1, "#heading-roles"), false);
}

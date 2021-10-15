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
	rolesInputsElCol: document.getElementsByClassName("input-roles"),
	quotaInputsElCol: document.getElementsByClassName("input-quota"),
	addRows: function (/** @type {number} */ whichTemplate, /** @type {string} */ whichInputTable) {
		const content = this.inputTemplates[whichTemplate].content;
		return function () {
			const clone = content.cloneNode(true);
			document.querySelector(whichInputTable + " tbody").appendChild(clone);
		};
	},
	addCounterTrackersToInputs: function (index) {
		inputRows.membersInputsElCol[index].addEventListener("keyup", inputTracker.makeInputDataGetterHandler("Members"), false);
		inputRows.membersInputsElCol[index].addEventListener("keyup", inputTracker.trackMembersTotal, false);
		inputRows.rolesInputsElCol[index].addEventListener("keyup", inputTracker.makeInputDataGetterHandler("Roles"), false);
		inputRows.quotaInputsElCol[index].addEventListener("keyup", inputTracker.makeInputDataGetterHandler("Quota"), false);
		inputRows.quotaInputsElCol[index].addEventListener("keyup", inputTracker.trackQuotaTotal, false);
		inputRows.quotaInputsElCol[index].addEventListener("keydown", inputTracker.makeInputDataGetterHandler("Quota"), false);
		inputRows.quotaInputsElCol[index].addEventListener("keydown", inputTracker.trackQuotaTotal, false);
	}
};

const inputTracker = {
	counters: document.querySelectorAll(".counter-number"),
	membersCounter: 0,
	quotaCounter: 0,
	makeInputDataGetterHandler: function (/** @type {String} */ whichInputData) {
		return function () {
			inputData[`get${whichInputData}Input`]();
		};
	},
	trackMembersTotal: function () {
		inputTracker.membersCounter = inputData.membersInput.length;
		inputTracker.counters[0].innerHTML = `${inputTracker.membersCounter}`;
		inputTracker.checkIfCountersSame();
	},
	trackQuotaTotal: function () {
		inputTracker.quotaCounter = inputData.quotaInput.reduce(function (a, b) {
			return a + b;
		});
		inputTracker.counters[1].innerHTML = `${inputTracker.quotaCounter}`;
		inputTracker.checkIfCountersSame();
	},
	checkIfCountersSame: function () {
		if (inputTracker.membersCounter === inputTracker.quotaCounter) {
			for (let counter of inputTracker.counters) {
				counter.classList.add("counter-same");
			}
		} else {
			for (let counter of inputTracker.counters) {
				if (counter.classList.contains("counter-same")) {
					counter.classList.replace("counter-same", "counter-different");
				} else {
					counter.classList.add("counter-different");
				}
			}
		}
	}
};

const inputValidity = {
	/**
	 * @this {HTMLInputElement}
	 */
	checkIfRoleInputsValid: function (e) {
		/**@type {HTMLTableRowElement}*/
		// @ts-ignore
		const inputRowParent = this.parentNode.parentNode;
		const rowParentInputs = [...inputRowParent.getElementsByTagName("input")];
		let isFrstInputFilled = rowParentInputs[0].value !== "";
		let isScndInputFilled = rowParentInputs[1].value !== "";
		// If they are both empty or filled
		if ((!isFrstInputFilled && !isScndInputFilled) || (isFrstInputFilled && isScndInputFilled)) {
			for (let input of rowParentInputs) {
				input.classList.remove("input-invalid");
			}
		} else if (isFrstInputFilled && !isScndInputFilled) {
			rowParentInputs[0].classList.remove("input-invalid");
			rowParentInputs[1].classList.add("input-invalid");
		} else if (!isFrstInputFilled && isScndInputFilled) {
			rowParentInputs[1].classList.remove("input-invalid");
			rowParentInputs[0].classList.add("input-invalid");
		}
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
// TODO put this and other roles stuff in inputData inside of its own object
function Roles(roleName, quota) {
	this.roleName = roleName;
	this.quota = quota;
	this.members = [];
}

// Set handlers to initial input elements
for (let i = 0; i < inputRows.membersInputsElCol.length; i++) {
	inputRows.addCounterTrackersToInputs(i);
	inputRows.rolesInputsElCol[i].addEventListener("keyup", inputValidity.checkIfRoleInputsValid, false);
	inputRows.quotaInputsElCol[i].addEventListener("keyup", inputValidity.checkIfRoleInputsValid, false);
}

for (let i = 0; i < inputRows.addMoreButtons.length; i++) {
	inputRows.addMoreButtons[i].addEventListener("click", inputRows.addRows(0, "#heading-members"), false);
	inputRows.addMoreButtons[i].addEventListener("click", inputRows.addRows(1, "#heading-roles"), false);
	inputRows.addMoreButtons[i].addEventListener(
		"click",
		function () {
			// Set handlers to the newly made inputs
			inputRows.addCounterTrackersToInputs(inputRows.membersInputsElCol.length - 1);
			inputRows.rolesInputsElCol[inputRows.membersInputsElCol.length - 1].addEventListener(
				"keyup",
				inputValidity.checkIfRoleInputsValid,
				false
			);
			inputRows.quotaInputsElCol[inputRows.membersInputsElCol.length - 1].addEventListener(
				"keyup",
				inputValidity.checkIfRoleInputsValid,
				false
			);
		},
		false
	);
}

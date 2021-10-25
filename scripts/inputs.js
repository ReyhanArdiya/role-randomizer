"use strict";

/**
 * Object to get and store the inputs from the user.
 */
const inputData = {
	/**
	 * Value expected to be string array of members names from the user's inputs assigned by {@link inputData.getMembersInput}.
	 * @type {?string[]}
	 */
	membersInput: null,
	/**
	 * Value expected to be string array of roles names from the user's inputs assigned by {@link inputData.getRolesInput}.
	 * @type {?string[]}
	 */
	rolesInput: null,
	/**
	 * Value expected to be number array of the quotas from the user's inputs assigned by {@link inputData.getQuotaInput}.
	 * @type {?number[]}
	 */
	quotaInput: null,
	// TODO i could put this in my library/snippet but i need to change inputTableQuery to select the input table element, not its container.
	/**
	 * Handler or function to get any inputs from any input table only from input elements that are filled.
	 * @param {string} inputTableQuery - CSS selector to select the input table  container element either by id or class.
	 * @param {number} tdColumn - Number to pick which column of the table to get inputs from.
	 * @returns {string[]} - Returns a string array of values from the requested input.
	 */
	getInputs: function (inputTableQuery, tdColumn) {
		let inputArr = [...document.querySelectorAll(`${inputTableQuery} table td:nth-of-type(${tdColumn})`)]
			.map(function (/**@type {HTMLInputElement | Element}*/ el) {
				return /**@type {HTMLInputElement}*/ (el.firstElementChild).value;
			})
			.filter(function (str) {
				return str !== "";
			});
		inputArr.forEach(function (str, i, arr) {
			arr[i] = str.trim();
		});
		return inputArr;
	},
	/**
	 * Set inputs returned by {@link inputData.getInputs} to {@link inputData.membersInput}.
	 */
	getMembersInput: function () {
		inputData.membersInput = inputData.getInputs("#heading-members", 1);
	},
	/**
	 * Set inputs returned by {@link inputData.getInputs} to {@link inputData.rolesInput}.
	 */
	getRolesInput: function () {
		inputData.rolesInput = inputData.getInputs("#heading-roles", 1);
	},
	/**
	 * Set inputs returned by {@link inputData.getInputs} to {@link inputData.quotaInput}.
	 */
	getQuotaInput: function () {
		inputData.quotaInput = inputData.getInputs("#heading-roles", 2).map(function (str) {
			return ~~str;
		});
	},
	/**
	 * Method to return array of {@link RolesObj}.
	 * @param {string[]} roleNameArr - String array of role names, usually taken from {@link inputData.rolesInput}.
	 * @param {number[]} quotaArr - Number array of role quotas, usually taken from {@link inputData.quotaInput}.
	 * @param {number} totalRoles - Number of total roles, can be passed roleNameArr.length.
	 * @returns {RolesObj[]} - An object array where each item is a {@link RolesObj}.
	 */
	makeRolesCollection: function (roleNameArr, quotaArr, totalRoles) {
		const rolesArr = [];
		for (let i = 0; i < totalRoles; i++) {
			rolesArr.push(new Roles(roleNameArr[i], quotaArr[i]));
		}
		return rolesArr;
	},
	/**
	 * Randomizes {@link inputData.membersInput} & {@link randomizerEngine.rolesCollection} using {@link randomizeArr}.
	 */
	randomizeProps: function () {
		randomizeArr(this.membersInput);
		randomizeArr(randomizerEngine.rolesCollection);
	},
	/**
	 * Console.table {@link inputData.membersInput}, {@link randomizerEngine.rolesCollection}, [{@link inputData.rolesInput}, {@link inputData.quotaInput}] and {@link randomizerEngine.results}.
	 */
	cologData: function () {
		console.table(randomizerEngine.rolesCollection);
		console.table([this.rolesInput, this.quotaInput]);
		console.table(this.membersInput);
		console.table(randomizerEngine.results);
	}
};

/**
 * Object to store information about the input rows in each input table.
 */
const inputRows = {
	/**
	 * Node list of the add more buttons below the input tables.
	 * @type {NodeListOf<HTMLElement>}
	 */
	addMoreButtons: document.querySelectorAll(".add-more-button"),
	/**
	 * Node list of the templates for each input rows.
	 * @type {NodeListOf<HTMLTemplateElement>}
	 */
	inputTemplates: document.querySelectorAll("template"),
	/**
	 * HTMLCollectionOf of the input elements in the members input table.
	 * @type {HTMLCollectionOf<HTMLInputElement> | undefined}
	 */
	membersInputsElCol: document.querySelector("#heading-members table")?.getElementsByTagName("input"),
	/**
	 * HTMLCollectionOf of the input elements in the roles input table Roles column.
	 * @type {HTMLCollectionOf<HTMLInputElement> | HTMLCollectionOf<Element>}
	 */
	rolesInputsElCol: document.getElementsByClassName("input-roles"),
	/**
	 * HTMLCollectionOf of the input elements in the roles input table Quota column.
	 * @type {HTMLCollectionOf<HTMLInputElement> | HTMLCollectionOf<Element>}
	 */
	quotaInputsElCol: document.getElementsByClassName("input-quota"),
	/**
	 * Handler to add rows to a input table.
	 * @param {number} whichTemplate - Number to indicate which template to use in the {@link inputRows.inputTemplates}.
	 * @param {string} whichInputTable - Id or class of the table element to add the rows to.
	 * @returns {Function}
	 */
	addRows: function (whichTemplate, whichInputTable) {
		const content = this.inputTemplates[whichTemplate].content;
		return function () {
			const clone = content.cloneNode(true);
			document.querySelector(whichInputTable + " tbody")?.appendChild(clone);
		};
	},
	/**
	 * Method to add necessary handlers to the members inputs {@link inputRows.membersInputsElCol}.
	 * @param {"current" | "new"} which - String to give the handlers to the "current" 5 inputs or the "new" inputs made when clicking on {@link inputRows.addMoreButtons} buttons.
	 */
	addHandlersToMembersInputs: function (which) {
		let i;
		which === "current" ? (i = 0) : (i = /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.membersInputsElCol).length - 1);
		while (i < /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.membersInputsElCol).length) {
			/**@type {HTMLCollectionOf<HTMLInputElement>}*/
			(inputRows.membersInputsElCol)[i].addEventListener(
				"keyup",
				() => {
					inputData.getMembersInput();
					inputTracker.trackMembersTotal();
					inputValidity.findDuplicateMembers();
					inputValidity.fixDuplicateMembersName();
				},
				false
			);
			i++;
		}
	},
	/**
	 * Method to add necessary handlers to the roles inputs {@link inputRows.rolesInputsElCol}.
	 * @param {"current" | "new"} which - String to give the handlers to the "current" 5 inputs or the "new" inputs made when clicking on {@link inputRows.addMoreButtons} buttons.
	 */
	addHandlersToRolesInputs: function (which) {
		let i;
		which === "current" ? (i = 0) : (i = /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.rolesInputsElCol).length - 1);
		while (i < /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.rolesInputsElCol).length) {
			/**@type {HTMLCollectionOf<HTMLInputElement>}*/
			(inputRows.rolesInputsElCol)[i].addEventListener(
				"keyup",
				e => {
					inputData.getRolesInput();
					inputValidity.checkIfRoleInputsValid.call(e.target);
				},
				false
			);
			i++;
		}
	},
	/**
	 * Method to add necessary handlers to the quota inputs {@link inputRows.quotaInputsElCol}.
	 * @param {"current" | "new"} which - String to give the handlers to the "current" 5 inputs or the "new" inputs made when clicking on {@link inputRows.addMoreButtons} buttons.
	 */
	addHandlersToQuotaInputs: function (which) {
		let i;
		which === "current" ? (i = 0) : (i = /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.quotaInputsElCol).length - 1);
		while (i < /**@type {HTMLCollectionOf<HTMLInputElement>}*/ (inputRows.quotaInputsElCol).length) {
			/**@type {HTMLCollectionOf<HTMLInputElement>}*/
			(inputRows.quotaInputsElCol)[i].addEventListener(
				"keydown",
				() => {
					inputData.getQuotaInput();
					inputTracker.trackQuotaTotal();
				},
				false
			);
			/**@type {HTMLCollectionOf<HTMLInputElement>}*/
			(inputRows.quotaInputsElCol)[i].addEventListener(
				"keyup",
				e => {
					inputData.getQuotaInput();
					inputTracker.trackQuotaTotal();
					inputValidity.checkIfRoleInputsValid.call(e.target);
				},
				false
			);
			i++;
		}
	}
};

inputRows.addHandlersToMembersInputs("current");
inputRows.addHandlersToRolesInputs("current");
inputRows.addHandlersToQuotaInputs("current");
for (let i = 0; i < inputRows.addMoreButtons.length; i++) {
	inputRows.addMoreButtons[i].addEventListener(
		"click",
		() => {
			inputRows.addRows(0, "#heading-members")();
			inputRows.addRows(1, "#heading-roles")();
			inputRows.addHandlersToMembersInputs("new");
			inputRows.addHandlersToRolesInputs("new");
			inputRows.addHandlersToQuotaInputs("new");
		},
		false
	);
	inputRows.addMoreButtons[i].addEventListener(
		"keydown",
		e => {
			if (e.key === "Enter") {
				inputRows.addRows(0, "#heading-members")();
				inputRows.addRows(1, "#heading-roles")();
				inputRows.addHandlersToMembersInputs("new");
				inputRows.addHandlersToRolesInputs("new");
				inputRows.addHandlersToQuotaInputs("new");
			}
		},
		false
	);
}

/**
 * Object to store information about the input counters.
 */
const inputTracker = {
	/**
	 * Node list of the counter elements.
	 * @type {NodeListOf<HTMLParagraphElement>}
	 */
	counters: document.querySelectorAll(".counter-number"),
	/**
	 * Number to track the members input that has a character other than "".
	 * @type {number | undefined}
	 */
	membersCounter: 0,
	/**
	 * Number to track the total quota inputs from all the input elements in the quota column.
	 * @type {number | undefined}
	 */
	quotaCounter: 0,
	/**
	 * Handler to track the total members
	 * @returns {void}
	 */
	trackMembersTotal: function () {
		inputTracker.membersCounter = inputData.membersInput?.length;
		inputTracker.counters[0].innerHTML = `${inputTracker.membersCounter}`;
		inputTracker.checkIfCountersSame();
	},
	/**
	 * Handler to track the total quota
	 * @returns {void}
	 */
	trackQuotaTotal: function () {
		if (inputData.quotaInput?.length) {
			inputTracker.quotaCounter = inputData.quotaInput?.reduce((a, b) => a + b);
			inputTracker.counters[1].innerHTML = `${inputTracker.quotaCounter}`;
		} else {
			inputTracker.counters[1].innerHTML = "0";
		}
		inputTracker.checkIfCountersSame();
	},
	/**
	 * Handler to validate if {@link inputTracker.membersCounter} has the same value as {@link inputTracker.quotaCounter} which will then change the colors of the counter elements {@link inputTracker.counters} to either red or green.
	 * @returns {void}
	 */
	checkIfCountersSame: function () {
		if (inputTracker.membersCounter === inputTracker.quotaCounter) {
			for (let counter of inputTracker.counters) {
				counter.classList.add("counter-same");
			}
			inputValidity.isTotalSame = true;
		} else {
			for (let counter of inputTracker.counters) {
				if (counter.classList.contains("counter-same")) {
					counter.classList.replace("counter-same", "counter-different");
				} else {
					counter.classList.add("counter-different");
				}
			}
			inputValidity.isTotalSame = false;
		}
	}
};

/**
 * Object to store if the inputs of the user are valid.
 */
const inputValidity = {
	/**
	 * Expected to be boolean to indicate if {@link inputTracker.membersCounter} has the same value as {@link inputTracker.quotaCounter}. This property value will be assigned by {@link inputTracker.checkIfCountersSame} when it is called.
	 * @type {?boolean}
	 */
	isTotalSame: null,
	/**
	 * Expected to be boolean to indicate if {@link inputTracker.membersCounter} has the same value as {@link inputTracker.quotaCounter}. This property value will be assigned by {@link inputTracker.checkIfCountersSame} when it is called.
	 * @type {?boolean}
	 */
	isRoleInputsValid: null,
	/**
	 * String array to store members name that are duplicates.
	 * @type {string[]}
	 */
	duplicateMembersName: [],
	/**
	 * Handler to check if the inputs in the Role & Quota table is valid. If there is an invalid role or quota cell, it will change the color of that cell to red until the row for that input cell is valid, which is when both of the input elements in the same row is filled.
	 * @this {HTMLInputElement}
	 * @returns {void}
	 */
	checkIfRoleInputsValid: function () {
		const inputRowParent = /**@type {HTMLTableRowElement}*/ (this.parentNode?.parentNode);
		const rowParentInputs = [...inputRowParent?.getElementsByTagName("input")];
		let isFrstInputFilled = rowParentInputs[0].value !== "";
		let isScndInputFilled = rowParentInputs[1].value !== "";
		// If they are both empty or filled
		if ((!isFrstInputFilled && !isScndInputFilled) || (isFrstInputFilled && isScndInputFilled)) {
			for (let input of rowParentInputs) {
				input.classList.remove("input-invalid");
			}
			inputValidity.isRoleInputsValid = true;
		} else if (isFrstInputFilled && !isScndInputFilled) {
			rowParentInputs[0].classList.remove("input-invalid");
			rowParentInputs[1].classList.add("input-invalid");
			inputValidity.isRoleInputsValid = false;
		} else if (!isFrstInputFilled && isScndInputFilled) {
			rowParentInputs[1].classList.remove("input-invalid");
			rowParentInputs[0].classList.add("input-invalid");
			inputValidity.isRoleInputsValid = false;
		}
	},
	/**
	 * Handler to check if there are any duplicate members. If there is, it will push that member's name to {@link inputValidity.duplicateMembersName}.
	 * @returns {void}
	 */
	findDuplicateMembers: function () {
		inputData.membersInput?.forEach(function (str, i, arr) {
			if (arr.indexOf(str) !== i && !inputValidity.duplicateMembersName.includes(str)) {
				inputValidity.duplicateMembersName.push(str);
			}
		});
	},
	/**
	 * Handler fix the duplicate members name in {@link inputData.membersInput} based on {@link inputValidity.duplicateMembersName}. The way it fixes this is by appending a counter for each name of the duplicate members and changing the name string instantly inside of {@link inputData.membersInput} without changing its index.
	 * @returns {void}
	 */
	fixDuplicateMembersName: function () {
		for (let dupMember of inputValidity.duplicateMembersName) {
			let counter = 1;
			for (let i = 0; i <= /**@type {number}*/ (inputData.membersInput?.length); i++) {
				if (dupMember === /**@type {string[]}*/ (inputData.membersInput)[i]) {
					/**@type {string[]}*/ (inputData.membersInput)[i] += ` ${counter}`;
					counter++;
				}
			}
		}
	}
};

/**
 * Randomize the items index in the original array and return the reference value to the original array.
 * @param {any[] | null | undefined} arr -  The array that will be randomized.
 * @returns {any[] | null | undefined} - The reference to arr.
 */
function randomizeArr(arr) {
	return arr?.sort(function () {
		return [-1, 1][Math.floor(Math.random() * 2)];
	});
}

/**
 * Object containing properties about a role's name, quota, and members.
 * @typedef {Object} RolesObj
 * @property {string} roleName
 * @property {number} quota
 * @property {string[]} members - String array of members that is assigned to this role.
 */

/**
 * Constructs Role object that contains information about a role.
 * @constructor
 * @param {string} roleName
 * @param {number} quota
 * @constructs {@link RolesObj}
 */
function Roles(roleName, quota) {
	this.roleName = roleName;
	this.quota = quota;
	/**
	 * An empty array to be pushed with the members for this Roles object.
	 * @type {any[] | string[]}
	 */
	this.members = [];
}

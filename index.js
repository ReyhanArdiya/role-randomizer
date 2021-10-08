//@ts-check
"use strict";
const areaNodes = [...document.querySelectorAll("*[id^='area']")];

// #region floating button behaviors

const floatingButtons = {
	floatingButtonsElements: document.querySelectorAll("#button-floating button"),
	currentScrollLoc: 0,
	growFloatButtons: function () {
		let bodyHeightReference = parseInt(getComputedStyle(document.body).height) * 0.1;
		floatingButtons.floatingButtonsElements[0].className =
			document.documentElement.scrollTop >= bodyHeightReference ? "floating-button-active" : "";
		floatingButtons.floatingButtonsElements[1].className =
			areaNodes[3].getBoundingClientRect().top <= bodyHeightReference ? "" : "floating-button-active";
	},
	checkScrollLoc: function () {
		for (let i = areaNodes.length - 1; i >= 0; i--) {
			if (areaNodes[i].getBoundingClientRect().top <= 0) {
				floatingButtons.currentScrollLoc = i;
				break;
			} // Whenever this is checked, iterate through all #area nodes starting from the end. If a node has their above border hit or exceed the above viewport (<= 0), change floatingButtons.currentScrollLoc to the index (i) of that node and breaks the loop so that variable i will refer to the node whose above border exceeded closest from the top of the viewport.
		}
	},
	// FIXME sometimes the scrolling stops midway
	scrollUp: function () {
		areaNodes[floatingButtons.currentScrollLoc].getBoundingClientRect().top === 0
			? areaNodes[floatingButtons.currentScrollLoc - 1].scrollIntoView(true)
			: areaNodes[floatingButtons.currentScrollLoc].scrollIntoView(true);
		floatingButtons.disableButton(this);
	},
	scrollDown: function () {
		areaNodes[floatingButtons.currentScrollLoc + 1].scrollIntoView(true);
		floatingButtons.disableButton(this);
	},
	disableButton: function (button) {
		button.disabled = true;
		setTimeout(function () {
			button.disabled = false;
		}, 500);
	},
	addScrollToButtons: function () {
		floatingButtons.floatingButtonsElements[0].addEventListener("click", floatingButtons.scrollUp, false);
		floatingButtons.floatingButtonsElements[1].addEventListener("click", floatingButtons.scrollDown, false);
	}
};
window.addEventListener("scroll", floatingButtons.growFloatButtons, false);
window.addEventListener("scroll", floatingButtons.checkScrollLoc, false);
floatingButtons.addScrollToButtons();

// #endregion floating button behaviors

// #region welcome area steps scrolling

const stepsScrolling = {
	stepsEl: document.querySelectorAll("#introduction li"),
	scrollMaker: function (/**@type {Number}*/ nodeTarget) {
		return function () {
			areaNodes[nodeTarget].scrollIntoView(true);
		};
	},
	addScroll: function () {
		let j = 1;
		for (let i = 0; i < stepsScrolling.stepsEl.length; i++) {
			stepsScrolling.stepsEl[i].addEventListener("click", stepsScrolling.scrollMaker(j), false);
			if (i === 1) {
				j++;
			}
		}
	}
};
stepsScrolling.addScroll();

// #endregion welcome area steps scrolling

// #region randomizer logic

/**
 * Randomize the items index in the original array and return the reference value to the original array
 * @param {any[]} arr
 */
function randomizeArr(arr) {
	return arr.sort(function () {
		return [-1, 1][Math.floor(Math.random() * 2)];
	});
}

// #region input data

const inputData = {
	membersInput: null,
	rolesInput: null,
	quotaInput: null,
	getInputs: function (inputTableQuery, tdColumn) {
		return [...document.querySelectorAll(inputTableQuery + " table td:nth-of-type(" + tdColumn + ")")].map(function (el) {
			// @ts-ignore
			return el.firstElementChild.value;
		});
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
	},
	false
);

// #endregion input data

function Roles(roleName, quota) {
	this.roleName = roleName;
	this.quota = quota;
	this.members = [];
}

const randomizerData = {
	randomizedMembers: null,
	rolesCollection: null,
	makeRolesCollection: function (roleNameArr, quotaArr, totalRoles) {
		const rolesArr = [];
		for (let i = 0; i < totalRoles; i++) {
			rolesArr.push(new Roles(roleNameArr[i], quotaArr[i]));
		}
		return rolesArr;
	}
};

// #endregion randomizer logic

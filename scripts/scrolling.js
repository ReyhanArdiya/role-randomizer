"use strict";

// #region floating button behaviors

const floatingButtons = {
	/**
	 * HTML collection of the two floating buttons on the document.
	 * @type {NodeListOf<HTMLButtonElement>}
	 */
	floatingButtonsElements: document.querySelectorAll("#button-floating button"),
	/**
	 * Index to indicate where the user is right now on {@link areaNodes}.
	 * @type {number}
	 */
	currentScrollLoc: 0,
	/**
	 * Handler to grow the {@link floatingButtons.floatingButtonsElements} when the user has scrolled to a specific length.
	 * @returns {void}
	 */
	growFloatButtons: function () {
		let bodyHeightReference = parseInt(getComputedStyle(document.body).height) * 0.1;
		floatingButtons.floatingButtonsElements[0].className =
			document.documentElement.scrollTop >= bodyHeightReference ? "floating-button-active" : "";
		floatingButtons.floatingButtonsElements[1].className =
			areaNodes[3].getBoundingClientRect().top <= bodyHeightReference ? "" : "floating-button-active";
	},
	/**
	 * Handler to check the current scroll location of the user which will then change {@link floatingButtons.currentScrollLoc}.
	 * @returns {void}
	 */
	checkScrollLoc: function () {
		for (let i = areaNodes.length - 1; i >= 0; i--) {
			if (areaNodes[i].getBoundingClientRect().top <= 1) {
				floatingButtons.currentScrollLoc = i;
				break;
			} // Whenever this is checked, iterate through all #area nodes starting from the end. If a node has their above border hit or exceed the above viewport (<= 0), change floatingButtons.currentScrollLoc to the index (i) of that node and breaks the loop so that variable i will refer to the node whose above border exceeded closest from the top of the viewport.
		}
	},
	// FIXME sometimes the scrolling stops midway
	/**
	 * Handler to scroll up when the user clicks on the above {@link floatingButtons.floatingButtonsElements}.
	 * @this {HTMLButtonElement}
	 * @returns {void}
	 */
	scrollUp: function () {
		areaNodes[floatingButtons.currentScrollLoc].getBoundingClientRect().top >= 0 &&
		areaNodes[floatingButtons.currentScrollLoc].getBoundingClientRect().top <= 1
			? areaNodes[floatingButtons.currentScrollLoc - 1].scrollIntoView(true)
			: areaNodes[floatingButtons.currentScrollLoc].scrollIntoView(true);
		floatingButtons.disableButton(this);
	},
	/**
	 * Handler to scroll up when the user clicks on the bottom {@link floatingButtons.floatingButtonsElements}.
	 * @this {HTMLButtonElement}
	 * @returns {void}
	 */
	scrollDown: function () {
		areaNodes[floatingButtons.currentScrollLoc + 1].scrollIntoView(true);
		floatingButtons.disableButton(this);
	},
	/**
	 * Handler to disable a {@link floatingButtons.floatingButtonsElements} after they are clicked. This is used to prevent scrolling spamming which could lead to bugs.
	 * @param {HTMLButtonElement} button - taken from one of the {@link floatingButtons.floatingButtonsElements}.
	 */
	disableButton: function (button) {
		button.disabled = true;
		setTimeout(function () {
			button.disabled = false;
		}, 500);
	},
	/**
	 * Add scrolling handlers to both {@link floatingButtons.floatingButtonsElements}.
	 * @returns {void}
	 */
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

/**
 * Object that contains properties and methods to handle the scrolling when the user clicks on the steps in the welcome area.
 */
const stepsScrolling = {
	/**
	 * The node list of the steps in welcome area.
	 * @type {NodeListOf<HTMLOListElement>}
	 */
	stepsEl: document.querySelectorAll("#introduction li"),
	/**
	 * Method to make a handler that will be assigned to a {@link stepsScrolling.stepsEl} that when it is clicked it will scrol the user into a {@link areaNodes}.
	 * @param {number} nodeTarget - Index to select which {@link areaNodes} to scroll into.
	 * @returns {EventListener} Handler that will scroll the user into an {@link areaNodes}.
	 */
	scrollMaker: function (nodeTarget) {
		return function () {
			areaNodes[nodeTarget].scrollIntoView(true);
		};
	},
	/**
	 * Method to add returned handler from {@link stepsScrolling.scrollMaker} to all {@link stepsScrolling.stepsEl} as an event listener when they are clicked.
	 * @returns {void}
	 */
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

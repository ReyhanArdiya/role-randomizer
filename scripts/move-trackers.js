"use strict";

/**
 * Object to store properties and methods about the trackers in the input area
 */
const totalTrackers = {
	/**
	 * Nodelist of the sections in input area
	 * @type {NodeList}
	 */
	inputAreaSections: document.querySelectorAll("section[id^='heading']"),
	/**
	 * Nodelist of both trackers in input area
	 * @type {NodeList}
	 */
	trackersCol: document.querySelectorAll("section[id^='heading']>footer"),
	/**
	 * Method to move both trackers to the bottom of the input area
	 */
	moveToBottom: function () {
		let combinedTrackers = document.createElement("footer");
		combinedTrackers.id = "combined-trackers";
		for (let tracker of totalTrackers.trackersCol) {
			combinedTrackers.appendChild(tracker);
		}
		areaNodes[1].appendChild(combinedTrackers);
	},
	/**
	 * Method to move both trackers back to their original location
	 */
	moveToOriginal: function () {
		for (let i = 0; i < totalTrackers.inputAreaSections.length; i++) {
			totalTrackers.inputAreaSections[i].appendChild(totalTrackers.trackersCol[i]);
			document.querySelector("#combined-trackers")?.remove();
		}
	},
	/**
	 * Method that calls both {@link totalTrackers.moveToBottom} & {@link totalTrackers.moveToOriginal}
	 */
	moveTrackers: function () {
		if (window.innerWidth <= 1000 && !document.querySelector("#combined-trackers")) {
			totalTrackers.moveToBottom();
		} else if (window.innerWidth >= 1001 && document.querySelector("#combined-trackers")) {
			totalTrackers.moveToOriginal();
		}
	}
};

totalTrackers.moveTrackers(); // To check on page start or relaod
window.addEventListener("resize", totalTrackers.moveTrackers, false);

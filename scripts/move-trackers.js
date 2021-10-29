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
		}
	}
};

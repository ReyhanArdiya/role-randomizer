//@ts-check
const inputRows = {
	addMoreButtons: document.querySelectorAll(".add-more-button"),
	inputTemplates: document.querySelectorAll("template"),
	membersInputs: document.querySelector("#heading-members table").getElementsByTagName("input"),
	quotaInputs: document.getElementsByClassName("input-quota"),
	/**
	 * @param {number} whichTemplate
	 * @param {string} whichInputTable
	 */
	addRows: function (whichTemplate, whichInputTable) {
		const content = this.inputTemplates[whichTemplate].content;
		return function () {
			const clone = content.cloneNode(true);
			document.querySelector(whichInputTable + " tbody").appendChild(clone);
		};
	}
};

for (let i = 0; i < inputRows.addMoreButtons.length; i++) {
	inputRows.addMoreButtons[i].addEventListener("click", inputRows.addRows(0, "#heading-members"), false);
	inputRows.addMoreButtons[i].addEventListener("click", inputRows.addRows(1, "#heading-roles"), false);
}

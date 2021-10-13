//@ts-check
const addMoreButtons = document.querySelectorAll(".add-more-button");
const inputTemplates = document.querySelectorAll("template");

/**
 * @param {number} whichTemplate
 * @param {string} whichInputTable
 */
function addRows(whichTemplate, whichInputTable) {
	const content = inputTemplates[whichTemplate].content;
	return function () {
		const clone = content.cloneNode(true);
		document.querySelector(whichInputTable + " tbody").appendChild(clone);
	};
}

for (let i = 0; i < addMoreButtons.length; i++) {
	addMoreButtons[i].addEventListener("click", addRows(0, "#heading-members"), false);
	addMoreButtons[i].addEventListener("click", addRows(1, "#heading-roles"), false);
}

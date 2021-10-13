// TODO add this new version to my library
/**
 * This function will sort a table rows based on the content of a column in the tbody of the table. This function will return a function that will do the sorting, so it can be assigned to a handler or somewhere else.
 * @param {string} whichTable - The id or class of the table element of the table
 * @param {Number} whichTableColumn - The column of the table. The column is based on the order of the td in each tr in the tbody.
 * @param {string} ascOrDesc - Takes  "desc" to sort descending, else it will sort ascending.
 * @param {string} numberOrString - Takes  "string" to sort the column based on string data type, else it will sort based on numbers. The data type of each cell in the column can only be all strings or all numbers, no mixing allowed for this function to work.
 * @returns function
 */
function sortTable(whichTable, whichTableColumn, ascOrDesc = "asc", numberOrString = "number") {
	const tableColumn = [...document.querySelectorAll(whichTable + " tbody td:nth-of-type(" + whichTableColumn + ")")];
	const tableBody = document.querySelector(whichTable + " tbody");
	const tableRow = []; // Array to store the parent (the tr) of each td that was sorted.
	tableColumn.sort(function (item1, item2) {
		if (numberOrString == "number") {
			return ascOrDesc == "asc"
				? parseFloat(item1.innerText) - parseFloat(item2.innerText)
				: parseFloat(item2.innerText) - parseFloat(item1.innerText);
		} else {
			if (ascOrDesc == "asc") {
				if (item1.innerText > item2.innerText) {
					return 1;
				} else if (item1.innerText === item2.innerText) {
					return 0;
				} else {
					return -1;
				}
			} else {
				if (item1.innerText < item2.innerText) {
					return 1;
				} else if (item1.innerText === item2.innerText) {
					return 0;
				} else {
					return -1;
				}
			}
		}
	});
	for (let eachCellsRow of tableColumn) {
		tableRow.push(eachCellsRow.parentElement); // For each item which is a reference value to a td that has been sorted, get its parent and push it to the array. The ending result will be an array full of reference value to the table's tr that is sorted.
	}
	return function () {
		for (let row of tableRow) {
			tableBody.insertAdjacentElement("beforeend", row); // For each row, insert it as the last child of the tbody. Since the rows are already in order, this will reorder the trs either ascending or descending.
		}
	};
}

function addSortToButtons() {
	const paths = document.querySelectorAll("#results-container path");
	let column = 1;
	for (let i = 0; i < paths.length; i++) {
		if (!(i % 2)) {
			paths[i].addEventListener("click", sortTable("#randomized-table", column, "asc", "string"), false);
		} else {
			paths[i].addEventListener("click", sortTable("#randomized-table", column, "desc", "string"), false);
			column++;
		}
	}
}

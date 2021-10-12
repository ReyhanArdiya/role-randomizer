/**
 * This function will sort a table rows based on the content of a column in the tbody of the table.
 * @param {string} whichTable - The id or class of the table element of the table
 * @param {Number} whichTableDataColumn - The column of the table. The column is based on the order of the td in each tr in the tbody.
 * @param {string} ascOrDesc - Takes  "desc" to sort descending, else it will sort ascending.
 * @param {string} numberOrString - Takes  "string" to sort the column based on string data type, else it will sort based on numbers. The data type of each cell in the column can only be all strings or all numbers, no mixing allowed for this function to work.
 * @returns function
 */
function sortTable(whichTable, whichTableDataColumn, ascOrDesc = "asc", numberOrString = "number") {
	/**
	 * @type {Array}
	 */
	const tableDataColumn = [...document.querySelectorAll(whichTable + " tbody td:nth-of-type(" + whichTableDataColumn + ")")];
	const tableBody = document.querySelector(whichTable + " tbody");
	const tableDataColumnRow = []; // Array to store the parent (the tr) of each td that was sorted earlier.
	tableDataColumn.sort(function (item1, item2) {
		if (numberOrString == "number") {
			if (ascOrDesc == "asc") {
				return parseFloat(item1.innerText) - parseFloat(item2.innerText);
			} else {
				return parseFloat(item2.innerText) - parseFloat(item1.innerText);
			}
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
	for (let eachCellsRow of tableDataColumn) {
		tableDataColumnRow.push(eachCellsRow.parentElement); // For each item which is a reference value to a td that has been sorted, get it's parent and push it to the array. The ending result will be an array full of reference value to the tr in a sorted manner.
	}
	return function () {
		// Return a function reference with the enviroment(s) of its closure so that it can be used for example in a handler.
		for (let eachGonnaBeInsertedRows of tableDataColumnRow) {
			tableBody.insertAdjacentElement("beforeend", eachGonnaBeInsertedRows); // For each row, insert it as the last child of the tbody. Since the row is already in order, this will reorder each trs' current DOM position in the tbody (or its position visually in the viewport) to the new DOM position based off the items in tableDataColumnRow by appending each one before the end of the tbody children tree layer.
		}
	};
}

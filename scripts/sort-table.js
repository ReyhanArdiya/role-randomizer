// TODO add this new version to my library
/**
 * This function will sort a table's rows based on the content of a column in the tbody of the table. This function will return a handler that will do the sorting of the tr's in the HTML.
 * @param {string} whichTable - The id or class of the table element of the table.
 * @param {number} whichTableColumn - The column of the table. The column is based on the order of the td in each tr in the tbody.
 * @param {"asc" | "desc"} [ascOrDesc="asc"] - Takes  "desc" to sort descending or "asc" to sort ascending; default is "asc".
 * @param {"string" | "number"} [numberOrString="number"] - Takes  "string" to sort the column based on string data type or "number" to sort based on numbers; default is "number". The data type of each cell in the column can only be all strings or all numbers, no mixing allowed for this function to work. Example:
 * This will work {td1: string, td2: string, td3: string}.
 * This will not work {td1: number, td2: string, td3: string}.
 * @returns {EventListener} Handler that will do the sorting of the tr's in the HTML.
 */
function sortTable(whichTable, whichTableColumn, ascOrDesc = "asc", numberOrString = "number") {
	/**
	 * Spreaded node list of td elements in the selected table's column {@link whichTableColumn}.
	 * @type {HTMLTableCellElement[]}
	 */
	const tableColumnDataCells = /**@type {HTMLTableCellElement[]}*/ ([
		...document.querySelectorAll(`${whichTable} tbody td:nth-of-type(${whichTableColumn})`)
	]);
	const tableBody = document.querySelector(`${whichTable} tbody`);
	/**
	 * Array to store the parent of each td (the tr elements) that was sorted.
	 * @type {HTMLTableRowElement[]}
	 */
	const tableRow = [];
	tableColumnDataCells.sort(function (item1, item2) {
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
	for (let eachCellsRow of tableColumnDataCells) {
		/**
		 * For each td in {@link tableColumnDataCells} that has been sorted, get the td's parent (the tr element) and push it to {@link tableRow}. The final result will be an array full the table's tr that is sorted like the tds order in {@link tableColumnDataCells}.
		 */
		tableRow.push(/**@type {HTMLTableRowElement}*/ (eachCellsRow.parentElement));
	}
	/**
	 * The handler that will do the sorting of the tr's in the HTML.
	 */
	return function () {
		for (let row of tableRow) {
			/**
			 * For each tr, insert it as the last child of the tbody. Since the rows are already in order, this will reorder the rows either ascending or descending in the tbody.
			 */
			tableBody?.insertAdjacentElement("beforeend", row);
		}
	};
}

/**
 * Function to add the sort handlers from {@link sortTable} to the sorting buttons in the results table header.
 * @returns {void}
 */
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

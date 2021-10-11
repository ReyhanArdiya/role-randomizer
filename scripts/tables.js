//@ts-check
"use strict";
// #region results table maker

function makeResultsTable(results) {
	const table = document.createElement("table");
	for (let result of results) {
		const row = document.createElement("tr");
		const memberCell = document.createElement("td");
		memberCell.innerText = result[0];
		row.appendChild(memberCell);
		const roleCell = document.createElement("td");
		roleCell.innerText = result[1];
		row.appendChild(roleCell);
		table.appendChild(row);
	}
	return table;
}

// #endregion results table maker

// #region table animation

// #endregion table animation

"use strict";

/**
 * Array of spreaded Nodelist for each document areas (i.e.: welcome, input, results, QnA, author).
 * @type {HTMLDivElement[]}
 */
const areaNodes = /**@type {HTMLDivElement[]}*/ ([...document.querySelectorAll("*[id^='area']")]);

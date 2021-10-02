const areaNodes = [...document.querySelectorAll("*[id^='area']")]

// #region floating button behaviors

const floatingButtons = {
    floatingButtonsElements: document.querySelectorAll("#button-floating button"),
    currentScrollLoc: 0,
    growFloatButtons: function () {
        let bodyHeightReference = parseInt(getComputedStyle(document.body).height) * 0.10;
        floatingButtons.floatingButtonsElements[0].className = document.documentElement.scrollTop >= bodyHeightReference ? "floating-button-active" : "";
        floatingButtons.floatingButtonsElements[1].className = areaNodes[3].getBoundingClientRect().top <= bodyHeightReference ? "" : "floating-button-active";
    },
    // PROG this already works as intended
    // CMT add this when clicking the buttons too (i think i should call this AFTER it has scrolled to the area so that i will update to the current area)
    checkScrollLoc: function () {
        for (let i = areaNodes.length - 1; i >= 0; i--) {
            if (areaNodes[i].getBoundingClientRect().top <= 0) {
                floatingButtons.currentScrollLoc = i;
                break;
            } // Whenever this is checked, iterate through all #area nodes starting from the end. If a node has their above border hit or exceed the above viewport (<= 0), change floatingButtons.currentScrollLoc to the index (i) of that node and breaks the loop so that variable i will refer to the node whose above border exceeded closest from the top of the viewport.
        }
    },
    // CMT remmber to use scrollintoview
    // PROG do this tomorrow
    clickScrollUp: function () {
        ;
    },
    clickScrollDown: function () {
        ;
    },
};

window.addEventListener("scroll", floatingButtons.growFloatButtons, false);
window.addEventListener("scroll", floatingButtons.checkScrollLoc, false);

// #endregion floating button grow
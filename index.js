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
    checkScrollLoc: function () {
        for (let i = areaNodes.length - 1; i >= 0; i--) {
            if (areaNodes[i].getBoundingClientRect().top <= 0) {
                floatingButtons.currentScrollLoc = i;
                break;
            } // Whenever this is checked, iterate through all #area nodes starting from the end. If a node has their above border hit or exceed the above viewport (<= 0), change floatingButtons.currentScrollLoc to the index (i) of that node and breaks the loop so that variable i will refer to the node whose above border exceeded closest from the top of the viewport.
        }
    },
    // FIXME sometimes the scrolling stops midway
    // TODO add spam prevention
    scrollUp: function () {
        areaNodes[floatingButtons.currentScrollLoc].getBoundingClientRect().top === 0 ? areaNodes[floatingButtons.currentScrollLoc - 1].scrollIntoView(true) : areaNodes[floatingButtons.currentScrollLoc].scrollIntoView(true);
    },
    scrollDown: function () {
        areaNodes[floatingButtons.currentScrollLoc + 1].scrollIntoView(true);
    },
};
window.addEventListener("scroll", floatingButtons.growFloatButtons, false);
window.addEventListener("scroll", floatingButtons.checkScrollLoc, false);
floatingButtons.floatingButtonsElements[0].addEventListener("click", floatingButtons.scrollUp, false);
floatingButtons.floatingButtonsElements[1].addEventListener("click", floatingButtons.scrollDown, false);

// #endregion floating button grow
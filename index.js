const areaNodes = [...document.querySelectorAll("*[id^='area']")]
// #region floating button grow

const floatingButtons = {
    floatingButtonsElements: document.querySelectorAll("#button-floating button"),
    growFloatButtons: function () {
        let bodyHeightReference = parseInt(getComputedStyle(document.body).height) * 0.10;
        floatingButtons.floatingButtonsElements[0].className = document.documentElement.scrollTop >= bodyHeightReference ? "floating-button-active" : "";
        floatingButtons.floatingButtonsElements[1].className = areaNodes[3].getBoundingClientRect().top <= bodyHeightReference ? "" : "floating-button-active";
    }
};

window.addEventListener("scroll", floatingButtons.growFloatButtons, false);

// #endregion floating button grow
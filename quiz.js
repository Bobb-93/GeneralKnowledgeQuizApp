let dom={
    finishButton: document.getElementById("finish-button")
};

dom.finishButton.addEventListener("click", function () {
    location.assign("./results.html");
});
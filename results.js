let dom = {
    retryButton: document.getElementById("retry-button"),
    newQuizButton: document.getElementById("new-quiz-button"),

};

dom.retryButton.addEventListener("click", function () {
    location.assign("./quiz.html");  
});

dom.newQuizButton.addEventListener("click", function () {
    location.assign("./index.html");  
});
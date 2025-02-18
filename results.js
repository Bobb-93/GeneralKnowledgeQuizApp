let dom = {
    retryButton: document.getElementById("retry-button"),
    newQuizButton: document.getElementById("new-quiz-button"),
    correctAnswers: document.getElementById("correct-answers"),
    numberOfQuestions: document.getElementById("number-of-questions")

};

dom.retryButton.addEventListener("click", function () {
    // location.assign("./quiz.html");  
    history.back();
});

dom.newQuizButton.addEventListener("click", function () {
    location.assign("./index.html");  
});

document.addEventListener("DOMContentLoaded", function(){
    const params = new URLSearchParams(window.location.search);

    const correctAnswers = params.get("correctAnswers");
    dom.correctAnswers.innerText  = correctAnswers;

    const numberOfQuestions = params.get("number-of-questions");
    dom.numberOfQuestions.innerText  = numberOfQuestions;

});
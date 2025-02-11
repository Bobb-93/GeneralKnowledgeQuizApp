let randomOptions =[]
let currentQuestionIndex = 0;
let opts_input = Array.from(document.getElementsByName('options'));
let quizData = null;
let userScore = 0;
let currentQuestionNumber = 1
let quizCategory = null;

let dom = {
    beginButton: document.getElementById("begin-button"),

};

console.log(dom.newQuizButton);

dom.beginButton.addEventListener("click", function () {
    location.assign("./quiz.html");  
});


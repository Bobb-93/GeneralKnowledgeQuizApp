let randomOptions =[]
let opts_input = Array.from(document.getElementsByName('options'));
let userScore = 0;
let currentQuestionNumber = 1
let quizCategory = null;

let dom = {
    beginButton: document.getElementById("begin-button"),
    categorySelect: document.getElementById("category-select"),
    difficultyLabel: document.getElementById("difficulty-label"),
    difficultySelect: document.getElementById("difficulty-select")
};

dom.categorySelect.addEventListener("change", function () {
    if(dom.categorySelect.value){
        dom.difficultyLabel.style.visibility = "visible";
        dom.difficultySelect.style.visibility = "visible";
    } else {
        //just in case
        dom.difficultyLabel.style.visibility = "visible";
        dom.difficultySelect.style.visibility = "visible";
        dom.beginButton.style.visibility = "hidden";

    }
});

dom.difficultySelect.addEventListener("change", function () {
    if(dom.difficultySelect.value){
        dom.beginButton.style.visibility = "visible";
    } else {
        //just in case
        dom.beginButton.style.visibility = "hidden";
    }
})

dom.beginButton.addEventListener("click", function () {
    const category = document.getElementById("category-select").value;
    const difficulty = document.getElementById("difficulty-select").value;

    window.location.href = `quiz.html?category=${category}&difficulty=${difficulty}`;

    // location.assign("./quiz.html");  
});


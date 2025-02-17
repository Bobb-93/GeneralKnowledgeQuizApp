

let quizCategory = null;

let dom = {
    beginButton: document.getElementById("begin-button"),
    categorySelect: document.getElementById("category-select"),
    difficultyLabel: document.getElementById("difficulty-label"),
    questionAmountLabel: document.getElementById("question-amount-label"),
    questionAmount: document.getElementById("question-amount"),
    difficultySelect: document.getElementById("difficulty-select")
};

dom.categorySelect.addEventListener("change", function () {
    if(dom.categorySelect.value){
        dom.questionAmountLabel.style.visibility = "visible";
        dom.questionAmount.style.visibility = "visible";
        dom.difficultyLabel.style.visibility = "visible";
        dom.difficultySelect.style.visibility = "visible";
    } else {
        //just in case
        dom.difficultyLabel.style.visibility = "hidden";
        dom.difficultySelect.style.visibility = "hidden";
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
    const category = dom.categorySelect.value;
    const categoryText = dom.categorySelect.options[dom.categorySelect.selectedIndex].text;
    const numberOfQuestions = document.getElementById("question-amount").value;
    const difficulty = document.getElementById("difficulty-select").value;

    window.location.href = `quiz.html?category=${category}&categoryText=${categoryText}&numberOfQuestions=${numberOfQuestions}&difficulty=${difficulty}`;

    // location.assign("./quiz.html");  
});


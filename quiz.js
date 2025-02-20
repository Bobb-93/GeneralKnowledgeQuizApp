const dom = {
    displayCategory: document.getElementById("display-category"),
    displayDifficulty: document.getElementById("display-difficulty"),
    finishButton: document.getElementById("finish-button"),
    questionNumber: document.getElementById("question-number"),
    totalQuestions: document.getElementById("total-questions"),
    questionText: document.getElementById("question-text"),
    optionsArea: document.getElementById("options-area"),
    feedbackText: document.getElementById("feedback-text")
};

function shuffleOptions(options) {

    let shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

let quizData = null;
let currentQuestionNumber = 0;
let randomOptions = [];
let correctAnswers = 0;
let correctAnswer;

//for testing
// dom.finishButton.addEventListener("click", function () {
//     location.assign("./results.html");
// });

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const numberOfQuestions = params.get("numberOfQuestions");
    dom.totalQuestions.innerText = numberOfQuestions;

    const category = params.get("category");
    dom.displayCategory.innerText = params.get("categoryText");

    const difficulty = params.get("difficulty");
    dom.displayDifficulty.innerText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    console.log("Selected Category:", category);
    console.log("Selected Difficulty:", difficulty);

    async function getQuizData() {
        console.log('async function');

        let url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
        // localStorage.setItem("retryURL", url);

        try {
            let data = await fetch(url);
            if (!data.ok) {
                throw new Error('Failed to fetch data');
            }
            return await data.json();
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

    async function startQuiz() {
        quizData = await getQuizData();

        if (!quizData || !quizData.results || quizData.results.length === 0) {
            console.error("No quiz data received.");
            dom.questionText.innerText = "Not enough questions available for this category and difficulty. Please try another category/another difficulty or reduce the number of questions.";

            let backButton = document.createElement("button");
            backButton.id = "back-button";
            backButton.innerText = "Back";
            backButton.addEventListener("click", () => location.assign("./index.html"));
            dom.optionsArea.appendChild(backButton);

            return;
        }

        console.log(quizData);

        nextQuestion();
    }

    function nextQuestion() {
        if (currentQuestionNumber >= quizData.results.length) {

            let nextButton = document.getElementById("next-button");

            if (nextButton) {
                nextButton.style.display = "none";
            }

            let finishQuizButton;

            if (!finishQuizButton) {
                finishQuizButton = document.createElement("button");
                finishQuizButton.id = "finish-quiz-button";
                finishQuizButton.innerText = "Finish Quiz";
                finishQuizButton.addEventListener("click", function () {
                    window.location.href = `results.html?correctAnswers=${correctAnswers}&numberOfQuestions=${numberOfQuestions}`;
                });
                dom.optionsArea.appendChild(finishQuizButton);
            }

            return;
        }

        let question = quizData.results[currentQuestionNumber];
        correctAnswer = question.correct_answer;
        let options = [...question.incorrect_answers, correctAnswer];

        let shuffledOptions = shuffleOptions(options);

        dom.questionNumber.innerText = currentQuestionNumber + 1;
        dom.questionText.innerText = question.question;

        //clear optionsArea
        dom.optionsArea.innerHTML = "";

        shuffledOptions.forEach(option => {
            let optionElement = document.createElement("li");

            optionElement.innerHTML = `
                <label>
                    <input type="radio" name="answer" value="${option}"> ${option} 
                </label>
            `;

            //highlight selected answer
            let radioInput = optionElement.querySelector("input");
            let label = optionElement.querySelector("label");

            radioInput.addEventListener("change", function () {
                document.querySelectorAll("#options-area label").forEach(l => {
                    l.style.color = "black";
                    l.style.fontWeight = "normal";
                });
                label.style.color = "#2D96C2";
                label.style.fontWeight = "bold";
            });

            dom.optionsArea.appendChild(optionElement);
        });

        let nextButton = document.getElementById("next-button");

        //Show "Next button"
        if (!document.getElementById("next-button")) {
            let nextButton = document.createElement("button");
            nextButton.id = "next-button";
            nextButton.innerText = "Next";
            nextButton.addEventListener("click", checkAnswer);
            dom.optionsArea.appendChild(nextButton);
        }
    }

    function checkAnswer() {
        let selectedOption = document.querySelector(`input[name="answer"]:checked`);

        if (!selectedOption) {
            alert("Please select an answer!");
            return;
        }

        let userAnswer = selectedOption.value;

        dom.feedbackText.style.visibility = "visible";

        //trouble with "Romeo & Juliet" vs "Romeo &amp; Juliet" answer
        if (userAnswer.replace(/&(amp);|&/g, "and") === correctAnswer.replace(/&(amp);|&/g, "and")) {
            correctAnswers++;
            dom.feedbackText.style.color = "#0F0";
            dom.feedbackText.innerText = "Right Answer!";
        } else {
            dom.feedbackText.style.color = "#F00";
            dom.feedbackText.innerText = `Wrong Answer! The right answer is ${correctAnswer}.`;
        }

        // dom.feedbackText.style.color = "initial";
        currentQuestionNumber++;
        nextQuestion();
    }


    startQuiz();

});
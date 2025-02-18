let dom = {
    displayCategory: document.getElementById("display-category"),
    displayDifficulty: document.getElementById("display-difficulty"),
    finishButton: document.getElementById("finish-button"),
    questionNumber: document.getElementById("question-number"),
    totalQuestions: document.getElementById("total-questions"),
    questionText: document.getElementById("question-text"),
    optionsArea: document.getElementById("options-area"),
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

        if (!quizData || !quizData.results) {
            console.error("No quiz data received.");
            return;
        }

        console.log(quizData);

        nextQuestion();
    }

    function nextQuestion() {
        if (currentQuestionNumber >= quizData.results.length) {
            window.location.href = `results.html?correctAnswers=${correctAnswers}&numberOfQuestions=${numberOfQuestions}`;
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

            dom.optionsArea.appendChild(optionElement);
        });

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

        if (userAnswer === correctAnswer) {
            correctAnswers++;
        }

        currentQuestionNumber++;
        nextQuestion();
    }

    startQuiz();
});
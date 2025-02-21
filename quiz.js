const dom = {
    displayCategory: document.getElementById("display-category"),
    displayDifficulty: document.getElementById("display-difficulty"),
    finishButton: document.getElementById("finish-button"),
    questionNumber: document.getElementById("question-number"),
    totalQuestions: document.getElementById("total-questions"),
    questionText: document.getElementById("question-text"),
    optionsArea: document.getElementById("options-area"),
    feedbackText: document.getElementById("feedback-text"),
    countDown: document.getElementById("count-down"),
    countDownSpan: document.querySelector("#count-down .game-variables")
};

function shuffleOptions(options) {

    let shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function decodeHtmlEntities(text) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/html");
    return doc.body.textContent || "";
}

let quizData = null;
let currentQuestionNumber = 0;
let randomOptions = [];
let correctAnswers = 0;
let correctAnswer;
let count;
let interval;
let answered;

// let nextButton;
// let finishQuizButton;

//for testing
// dom.finishButton.addEventListener("click", () => {
//     location.assign("./results.html");
// });

document.addEventListener("DOMContentLoaded", () => {
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
            dom.countDown.innerText = "";

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

        console.log('we moveee');

        dom.feedbackText.style.visibility = "hidden";
        dom.feedbackText.innerText = "";

        if (currentQuestionNumber >= quizData.results.length) {

            console.dir(`dom.optionsAreaRadioButton: ${dom.optionsAreaRadioButtons}`);
            
            document.querySelectorAll(`input[type="radio"]`).forEach( radioButton =>
                radioButton.setAttribute("disabled", "disabled")
            );

            dom.countDown.style.visibility = "hidden";

            let nextButton = document.getElementById("next-button");

            if (nextButton) {
                nextButton.style.display = "none";
            }

            if (!document.getElementById("finish-quiz-button")) {

                let finishQuizButton = document.createElement("button");
                finishQuizButton.id = "finish-quiz-button";
                finishQuizButton.innerText = "Finish Quiz";
                finishQuizButton.addEventListener("click", () => {
                    window.location.href = `results.html?correctAnswers=${correctAnswers}&numberOfQuestions=${numberOfQuestions}`;
                });

                dom.optionsArea.appendChild(finishQuizButton);
            }

            return;
        }

        //timer countdown

        count = 10;

        let question = quizData.results[currentQuestionNumber];
        correctAnswer = decodeHtmlEntities(question.correct_answer);
        let options = [...question.incorrect_answers, correctAnswer];

        let shuffledOptions = shuffleOptions(options);

        dom.questionNumber.innerText = currentQuestionNumber + 1;
        dom.questionText.innerText = decodeHtmlEntities(question.question);

        // dom.questionText.innerText = (question.question).replace(/&amp;/g, "&")
        //                                             .replace(/&#039;/g, "'")
        //                                             .replace(/&quot;/g, `"`);

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

            radioInput.addEventListener("change", () => {
                document.querySelectorAll("#options-area label").forEach(optionLabel => {
                    optionLabel.style.color = "black";
                    optionLabel.style.fontWeight = "normal";
                });
                label.style.color = "#2D96C2";
                label.style.fontWeight = "bold";
            });

            dom.optionsArea.appendChild(optionElement);
        });

        clearInterval(interval);

        //Prevent multiple calls
        answered = false;

        interval = setInterval(function () {

            if (count > 0) {
                dom.countDownSpan.innerHTML = count;
                count--;
            } else {
                clearInterval(interval);
                dom.countDownSpan.innerHTML = "You're out of time!";

                if(!answered){
                    answered = true;
                    checkAnswer();
                }
            }

        }, 1000);

        //Show "Next button"
        if (!document.getElementById("next-button")) {
            let nextButton = document.createElement("button");
            nextButton.id = "next-button";
            nextButton.innerText = "Next";

            // let interval = setInterval(function () {
            //     dom.countDownSpan.innerHTML = count;

            //     if (count === 0) {
            //         clearInterval(interval);
            //         dom.countDownSpan.innerHTML = "You're out of time!";
            //         // or...
            //         // alert("You're out of time!");
            //         checkAnswer();
            //         return;
            //     }
            //     count--;
            // }, 1000);

            nextButton.addEventListener("click", checkAnswer);
            dom.optionsArea.appendChild(nextButton);
        }
    }

    function checkAnswer() {
        console.log('checking...');

        let selectedOption = document.querySelector(`input[name="answer"]:checked`);
        dom.feedbackText.style.visibility = "visible";

        //hide the next button to prevent multiple clicks
        let nextButton = document.getElementById("next-button");
        if(nextButton){
            nextButton.style.display = "none";

            //Alternatives:
            // nextButton.disabled = true;// disable the button
            // nextButton.style.visibility = "hidden";//make the button hidden
        }

        if (!selectedOption) {
            console.log('we did not select');

            dom.feedbackText.style.color = "#8B0000";
            dom.feedbackText.innerText = `You have not selected an answer! The right answer is ${correctAnswer}.`;
            // dom.countDown.innerHTML = `Timer: <span class="game-variables"></span>`; 

            // nextQuestion();
            // return;
        } else {
            let userAnswer = decodeHtmlEntities(selectedOption.value);

            dom.feedbackText.style.visibility = "visible";

            //trouble with "Romeo & Juliet" vs "Romeo &amp; Juliet" answer
            //more trouble with: &#039; -> apostrophe and &quot; -> quote 
            // if (userAnswer.replace(/&(amp);|&/g, "and").replace(/&(#039);|'/g, "apostrophe").replace(/&(quot);|"/g, "quote")  ===
            //     correctAnswer.replace(/&(amp);|&/g, "and").replace(/&(#039);|'/g, "apostrophe").replace(/&(quot);|"/g, "quote")) {
            if(userAnswer === correctAnswer){
                correctAnswers++;
                dom.feedbackText.style.color = "#0F0";
                dom.feedbackText.innerText = "Right Answer!";
            } else {
                dom.feedbackText.style.color = "#F00";
                dom.feedbackText.innerText = `Wrong Answer! The right answer is ${correctAnswer}.`;
            }
        }

        answered = true;

        //// Small delay to let user see feedback
        setTimeout(() => {
            currentQuestionNumber++;
            nextQuestion();
        }, 1500);

    }

    startQuiz();

});
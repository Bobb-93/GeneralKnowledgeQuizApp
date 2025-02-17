let dom = {
    displayCategory: document.querySelector("#question-area>h2>span"),
    finishButton: document.getElementById("finish-button"),
    questionNumber: document.getElementById("question-number"),
    totalQuestions: document.getElementById("total-questions")
};

function shuffleOptions(options){
    
    let shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];    
    }

    return shuffled;
}

let quizData = null;
let userScore = 0;
let currentQuestionNumber = 1;
let randomOptions =[];

dom.finishButton.addEventListener("click", function () {
    location.assign("./results.html");
});

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    const numberOfQuestions = params.get("numberOfQuestions");
    dom.totalQuestions.innerText = numberOfQuestions;
    
    const category = params.get("category");
    
    dom.displayCategory.innerText = params.get("categoryText");

    const difficulty = params.get("difficulty");

    console.log("Selected Category:", category);
    console.log("Selected Difficulty:", difficulty);

    async function getQuizData() {
        console.log('async function');

        let url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;
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

        quizData.results.forEach((question, index) => {
            console.log(`Question ${index + 1}:`, question.question);
            let correctAnswer = question.correct_answer;
            console.log(`correctAnswer: ${correctAnswer}`);

            let options = [...question.incorrect_answers, question.correct_answer]; // Combine answers
            console.log("Options:", [...question.incorrect_answers, question.correct_answer]);

            let shuffledOptions = shuffleOptions(options); // Shuffle the options
            console.log(`Shuffled Options: ${shuffledOptions}`);


            // console.log(`Question ${index + 1}:`, question.question);
            // console.log("Options:", [...question.incorrect_answers, question.correct_answer]);

            // let correctAnswer = question.correct_answer;
            // console.log(correctAnswer);
            
            // randomOptions.push(...question.incorrect_answers, question.correct_answer);
            // shuffleOptions(randomOptions);
            // console.log(`Shuffled Options: ${randomOptions}`);

            // randomOptions = [];
        });

        
        
    }

    startQuiz();
});
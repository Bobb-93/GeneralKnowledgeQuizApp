let dom = {
    finishButton: document.getElementById("finish-button")
};

let quizData = null;


dom.finishButton.addEventListener("click", function () {
    location.assign("./results.html");
});

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const difficulty = params.get("difficulty");

    console.log("Selected Category:", category);
    console.log("Selected Difficulty:", difficulty);

    async function getQuizData() {
        console.log('async function');

        let url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
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
            console.log("Options:", [...question.incorrect_answers, question.correct_answer]);
        });
    }

    startQuiz();
});
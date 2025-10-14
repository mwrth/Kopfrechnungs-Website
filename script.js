let level = 1;
let correctAnswer = 0;
let timerInterval;
let timeLeft;

let totalQuestions = 0;
let correctCount = 0;

// === START TRAINING ===
function startTraining(selectedLevel) {
    level = selectedLevel;
    totalQuestions = 0;
    correctCount = 0;

    document.getElementById("levelSelect").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("training").style.display = "block";

    document.getElementById("levelTitle").innerText = "Level " + level;
    document.getElementById("progress").innerText = "Richtig: 0%";

    nextTask();
}

// === TIMER PRO AUFGABE ===
function startTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    document.getElementById("timer").innerText = "Zeit: " + timeLeft + "s";

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "Zeit: " + timeLeft + "s";

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// Wenn Zeit abläuft → Frage als falsch werten
function handleTimeout() {
    totalQuestions++;
    document.getElementById("feedback").innerHTML = `⏰ Zeit abgelaufen! Richtige Antwort: ${correctAnswer}`;

    updateProgress();
    setTimeout(nextTask, 1500);
}

// === AUFGABE GENERIEREN ===
function generateTask() {
    const ops = ["+", "-", "*", "/"];
    let num1, num2, op, question;

    if (level === 1) {
        num1 = Math.floor(Math.random() * 900) + 100; // 100–999
        num2 = Math.floor(Math.random() * 90) + 10;   // 10–99
    } else if (level === 2) {
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * 900) + 100;
    } else {
        num1 = Math.floor(Math.random() * 9000) + 1000;
        num2 = Math.floor(Math.random() * 900) + 100;
    }

    op = ops[Math.floor(Math.random() * ops.length)];

    if (op === "/") {
        num2 = Math.floor(Math.random() * 20) + 2;
        num1 = num2 * Math.floor(Math.random() * 50 + 2);
    }

    question = `${num1} ${op} ${num2}`;

    try {
        correctAnswer = eval(question);
    } catch {
        return generateTask();
    }

    correctAnswer = Math.round(correctAnswer);
    return question;
}

// === NÄCHSTE AUFGABE ===
function nextTask() {
    if (totalQuestions >= 20) {
        showResults();
        return;
    }

    document.getElementById("feedback").innerText = "";
    const task = generateTask();
    document.getElementById("task").innerText = task + " = ?";
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();

    // Timer nur für Level 2 & 3
    if (level === 2) startTimer(30);
    if (level === 3) startTimer(15);
    if (level === 1) document.getElementById("timer").innerText = "";
}

// === ANTWORT PRÜFEN ===
function checkAnswer() {
    const userInput = document.getElementById("answer").value.trim();
    const userAnswer = parseInt(userInput, 10);
    const feedback = document.getElementById("feedback");

    clearInterval(timerInterval);
    totalQuestions++;

    if (isNaN(userAnswer)) {
        feedback.innerHTML = "⚠️ Bitte eine ganze Zahl eingeben!";
    } else if (userAnswer === correctAnswer) {
        correctCount++;
        feedback.innerHTML = "✅ Richtig!";
    } else {
        feedback.innerHTML = `❌ Falsch. Richtige Antwort: ${correctAnswer}`;
    }

    updateProgress();
    setTimeout(nextTask, 1200);
}

// === PROGRESS ANZEIGEN ===
function updateProgress() {
    const percent = Math.round((correctCount / totalQuestions) * 100);
    document.getElementById("progress").innerText = `Richtig: ${percent}% (${correctCount}/${totalQuestions})`;
}

// === AUSWERTUNG ===
function showResults() {
    clearInterval(timerInterval);
    document.getElementById("training").style.display = "none";
    document.getElementById("results").style.display = "block";

    const percent = Math.round((correctCount / totalQuestions) * 100);
    document.getElementById("summary").innerHTML = `
    Du hast <b>${correctCount}</b> von <b>${totalQuestions}</b> Aufgaben richtig beantwortet.<br>
    Erfolgsquote: <b>${percent}%</b>
  `;
}

// === NEUSTART / LEVELMENÜ ===
function restartLevel() {
    clearInterval(timerInterval);
    startTraining(level);
}

function backToMenu() {
    clearInterval(timerInterval);
    document.getElementById("results").style.display = "none";
    document.getElementById("training").style.display = "none";
    document.getElementById("levelSelect").style.display = "block";
}
    
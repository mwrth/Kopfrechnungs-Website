let currentMode = ''; // 'free' oder 'series'
let currentLevel = 1;
let correctAnswer = 0;
let timerInterval;
let timeLeft;
let seriesNumber = 0;
let totalQuestions = 0;
let correctCount = 0;
let currentTask = "";

// === MENÜ-NAVIGATION ===
function showModeSelection(mode) {
    currentMode = mode;
    document.getElementById("mainMenu").style.display = "none";

    const modeTitle = document.getElementById("modeTitle");
    const modeDescription = document.getElementById("modeDescription");

    if (mode === 'free') {
        modeTitle.textContent = "Freies Rechnen";
        modeDescription.textContent = "Gemischte Rechenaufgaben mit verschiedenen Operatoren";
        document.getElementById("modeSelection").style.display = "block";
    } else {
        // Für Reihen lernen erst zur Zahleneingabe
        document.getElementById("seriesInput").style.display = "block";
    }
}

function backToMainMenu() {
    document.getElementById("modeSelection").style.display = "none";
    document.getElementById("seriesInput").style.display = "none";
    document.getElementById("training").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("mainMenu").style.display = "block";
    currentMode = '';
    seriesNumber = 0;
}

function backToModeSelection() {
    document.getElementById("seriesInput").style.display = "none";
    document.getElementById("modeSelection").style.display = "block";
}

function confirmSeries() {
    const input = document.getElementById("seriesNumber").value;
    seriesNumber = parseInt(input);

    if (isNaN(seriesNumber) || seriesNumber < 1 || seriesNumber > 1000) {
        alert("Bitte gib eine Zahl zwischen 1 und 1000 ein!");
        return;
    }

    // Zurück zur Level-Auswahl mit Reihen-Info
    document.getElementById("seriesInput").style.display = "none";
    document.getElementById("modeTitle").textContent = `${seriesNumber}er-Reihe lernen`;
    document.getElementById("modeDescription").textContent = `Multiplikation mit der ${seriesNumber}er-Reihe`;
    document.getElementById("modeSelection").style.display = "block";
}

function cancelTraining() {
    clearInterval(timerInterval);
    backToMainMenu();
}

// === TRAINING STARTEN ===
function startTraining(level) {
    currentLevel = level;
    totalQuestions = 0;
    correctCount = 0;

    document.getElementById("modeSelection").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("training").style.display = "block";

    // Titel setzen
    if (currentMode === 'free') {
        document.getElementById("levelTitle").textContent = `Freies Rechnen - Level ${level}`;
    } else {
        document.getElementById("levelTitle").textContent = `${seriesNumber}er-Reihe - Level ${level}`;
    }

    updateProgress();
    updateProgressBar();
    nextTask();
}

// === TIMER ===
function startTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    let color = "#28a745";

    if (timeLeft <= 5) {
        color = "#dc3545";
    } else if (timeLeft <= 10) {
        color = "#ffc107";
    }

    timerElement.innerHTML = `⏱️ <span style="color: ${color}">${timeLeft}s</span>`;
}

function handleTimeout() {
    totalQuestions++;
    document.getElementById("feedback").innerHTML =
        `<span style="color: #dc3545">⏰ Zeit abgelaufen!</span><br>Richtige Antwort: <strong>${correctAnswer}</strong>`;
    updateProgress();
    updateProgressBar();
    setTimeout(nextTask, 2000);
}

// === AUFGABEN GENERIEREN ===
function generateTask() {
    if (currentMode === 'free') {
        return generateFreeMathTask();
    } else {
        return generateSeriesTask();
    }
}

function generateFreeMathTask() {
    const ops = ["+", "-", "*", "/"];
    let num1, num2, op, question;

    if (currentLevel === 1) {
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * 90) + 10;
    } else if (currentLevel === 2) {
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

    if (op === "-" && num1 < num2) {
        [num1, num2] = [num2, num1];
    }

    question = `${num1} ${op} ${num2}`;

    try {
        correctAnswer = eval(question);
    } catch {
        return generateFreeMathTask();
    }

    correctAnswer = Math.round(correctAnswer);
    return question;
}

function generateSeriesTask() {
    // Immer bis 20 für alle Levels bei Reihen
    const multiplier = Math.floor(Math.random() * 20) + 1;
    correctAnswer = seriesNumber * multiplier;

    return `${seriesNumber} × ${multiplier}`;
}

// === NÄCHSTE AUFGABE ===
function nextTask() {
    if (totalQuestions >= 20) {
        showResults();
        return;
    }

    document.getElementById("feedback").innerText = "";
    currentTask = generateTask();
    document.getElementById("task").innerText = currentTask + " = ?";
    document.getElementById("answer").value = "";
    document.getElementById("answer").focus();

    // Timer basierend auf Level (für beide Modi gleich)
    if (currentLevel === 1) {
        document.getElementById("timer").innerText = "⏱️ Kein Zeitlimit";
    } else if (currentLevel === 2) {
        startTimer(30);
    } else {
        startTimer(15);
    }
}

// === ANTWORT PRÜFEN ===
function checkAnswer() {
    const userInput = document.getElementById("answer").value.trim();
    const userAnswer = parseInt(userInput, 10);
    const feedback = document.getElementById("feedback");

    clearInterval(timerInterval);

    if (userInput === "") {
        feedback.innerHTML = "⚠️ Bitte gib eine Antwort ein!";
        return;
    }

    if (isNaN(userAnswer)) {
        feedback.innerHTML = "⚠️ Bitte eine ganze Zahl eingeben!";
        return;
    }

    totalQuestions++;

    if (userAnswer === correctAnswer) {
        correctCount++;
        feedback.innerHTML = "✅ <strong>Richtig!</strong>";
        feedback.style.color = "#28a745";
    } else {
        feedback.innerHTML = `❌ <strong>Falsch.</strong><br>Richtige Antwort: <strong>${correctAnswer}</strong>`;
        feedback.style.color = "#dc3545";
    }

    updateProgress();
    updateProgressBar();
    setTimeout(nextTask, 1200);
}

// === PROGRESS ===
function updateProgress() {
    const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    document.getElementById("progress").innerHTML =
        `Fragen: <strong>${totalQuestions}/20</strong> | 
         Richtig: <strong>${correctCount}</strong> | 
         Erfolgsquote: <strong>${percent}%</strong>`;
}

function updateProgressBar() {
    const progress = (totalQuestions / 20) * 100;
    document.getElementById("progressFill").style.width = `${progress}%`;
}

// === AUSWERTUNG ===
function showResults() {
    clearInterval(timerInterval);
    document.getElementById("training").style.display = "none";
    document.getElementById("results").style.display = "block";

    const percent = Math.round((correctCount / totalQuestions) * 100);
    const resultIcon = document.getElementById("resultIcon");

    let icon, color, message;
    if (percent >= 90) {
        icon = "🏆"; color = "#28a745"; message = "Ausgezeichnet!";
    } else if (percent >= 70) {
        icon = "👍"; color = "#17a2b8"; message = "Gut gemacht!";
    } else if (percent >= 50) {
        icon = "💪"; color = "#ffc107"; message = "Weiter so!";
    } else {
        icon = "📚"; color = "#dc3545"; message = "Übung macht den Meister!";
    }

    resultIcon.innerHTML = `<div style="font-size: 48px;">${icon}</div>
                           <h3 style="color: ${color}">${message}</h3>`;

    document.getElementById("summary").innerHTML = `
        Du hast <strong>${correctCount}</strong> von <strong>${totalQuestions}</strong> Aufgaben richtig beantwortet.<br>
        Erfolgsquote: <strong style="color: ${color}">${percent}%</strong>
    `;
}

// === NEUSTART ===
function restartTraining() {
    clearInterval(timerInterval);
    startTraining(currentLevel);
}

// === ENTER-TASTE ===
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('answer').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    document.getElementById('seriesNumber').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            confirmSeries();
        }
    });
});
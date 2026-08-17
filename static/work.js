
const form = document.getElementById("predictionForm");
const resetButton = document.getElementById("resetButton");
const predictButton = document.getElementById("predictButton");

const scoreValueEl = document.getElementById("scoreValue");
const scoreCardEl = document.getElementById("scoreCard");
const studyCardEl = document.getElementById("studyCard");
const attendanceCardEl = document.getElementById("attendanceCard");
const sleepCardEl = document.getElementById("sleepCard");

const performanceLevelEl = document.getElementById("performanceLevel");
const scoreMessageEl = document.getElementById("scoreMessage");
const suggestionsListEl = document.getElementById("suggestionsList");
const scoreCircleEl = document.querySelector(".score-circle");

const progressMap = {
  study: {
    bar: document.getElementById("studyProgress"),
    text: document.getElementById("studyValue"),
  },
  attendance: {
    bar: document.getElementById("attendanceProgress"),
    text: document.getElementById("attendanceValue"),
  },
  previous: {
    bar: document.getElementById("previousProgress"),
    text: document.getElementById("previousValue"),
  },
  assignment: {
    bar: document.getElementById("assignmentProgress"),
    text: document.getElementById("assignmentValue"),
  },
  sleep: {
    bar: document.getElementById("sleepProgress"),
    text: document.getElementById("sleepValue"),
  },
};


function getNumberValue(id) {
  const value = document.getElementById(id).value;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function setProgress(key, percent) {
  const p = progressMap[key];
  const value = clamp(percent);
  p.bar.style.width = `${value}%`;
  p.text.textContent = `${Math.round(value)}%`;
}

function updateDashboard(data) {
  const { study_hours, attendance, previous_score, assignment_score, sleep_hours } = data;


  studyCardEl.textContent = `${study_hours.toFixed(1)} hrs`;
  attendanceCardEl.textContent = `${attendance.toFixed(1)}%`;
  sleepCardEl.textContent = `${sleep_hours.toFixed(1)} hrs`;

  
  const studyPercent = clamp((study_hours / 10) * 100);
  const sleepPercent = clamp((sleep_hours / 8) * 100);

  setProgress("study", studyPercent);
  setProgress("attendance", clamp(attendance));
  setProgress("previous", clamp(previous_score));
  setProgress("assignment", clamp(assignment_score));
  setProgress("sleep", sleepPercent);
}

function updateScore(score) {
  score = clamp(score);

  scoreValueEl.textContent = score.toFixed(2);
  scoreCardEl.textContent = score.toFixed(2);

  const degree = score * 3.6;
  scoreCircleEl.style.background =
    `conic-gradient(#6366f1 ${degree}deg, #edf0f6 ${degree}deg)`;

  let levelText, levelColor, messageText;

  if (score >= 85) {
    levelText = "🌟 Excellent Performance";
    levelColor = "#16a34a";
    messageText = "Excellent! Keep maintaining your current academic habits.";
  } else if (score >= 70) {
    levelText = "👍 Good Performance";
    levelColor = "#2563eb";
    messageText = "Good performance. A little improvement can take you to the next level.";
  } else if (score >= 50) {
    levelText = "📚 Average Performance";
    levelColor = "#d97706";
    messageText = "Your performance is average. Focus on study consistency and assignments.";
  } else {
    levelText = "⚠️ Needs Improvement";
    levelColor = "#dc2626";
    messageText = "Try increasing your study time and maintaining better attendance.";
  }

  performanceLevelEl.textContent = levelText;
  performanceLevelEl.style.color = levelColor;
  scoreMessageEl.textContent = messageText;
}

function generateSuggestions(data) {
  const { study_hours, attendance, assignment_score, sleep_hours } = data;
  const suggestions = [];

  // Study hours
  if (study_hours < 5) {
    suggestions.push({
      icon: "📚",
      text: "Try increasing your daily study time to at least 5 hours.",
    });
  } else {
    suggestions.push({
      icon: "✅",
      text: "Your study hours are good. Maintain your current consistency.",
    });
  }

  
  if (attendance < 75) {
    suggestions.push({
      icon: "📅",
      text: "Improve attendance. Try to maintain at least 75% attendance.",
    });
  } else if (attendance < 85) {
    suggestions.push({
      icon: "📈",
      text: "Your attendance is acceptable. Aim for 85% or higher.",
    });
  } else {
    suggestions.push({
      icon: "🌟",
      text: "Excellent attendance. Keep it above 85%.",
    });
  }

  
  if (assignment_score < 60) {
    suggestions.push({
      icon: "📝",
      text: "Spend more time on assignments to improve your score.",
    });
  } else {
    suggestions.push({
      icon: "✅",
      text: "Good assignment performance. Continue submitting quality work.",
    });
  }

 
  if (sleep_hours < 7) {
    suggestions.push({
      icon: "😴",
      text: "Try getting 7–8 hours of sleep for better concentration.",
    });
  } else {
    suggestions.push({
      icon: "😴",
      text: "Your sleep duration is healthy for maintaining concentration.",
    });
  }

  suggestionsListEl.innerHTML = "";

  for (const item of suggestions) {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.innerHTML = `<span>${item.icon}</span><p>${item.text}</p>`;
    suggestionsListEl.appendChild(div);
  }
}

function resetDashboard() {
  scoreValueEl.textContent = "--";
  scoreCardEl.textContent = "--";
  studyCardEl.textContent = "--";
  attendanceCardEl.textContent = "--";
  sleepCardEl.textContent = "--";

  performanceLevelEl.textContent = "Waiting for prediction";
  performanceLevelEl.style.color = "";

  scoreMessageEl.textContent = "Enter student details and predict performance.";

  scoreCircleEl.style.background =
    "conic-gradient(#6366f1 0deg, #edf0f6 0deg)";

  suggestionsListEl.innerHTML = `
    <div class="suggestion">
      <span>💡</span>
      <p>Enter your details to receive personalized suggestions.</p>
    </div>
  `;

  for (const key of Object.keys(progressMap)) {
    setProgress(key, 0);
  }
}

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const studentData = {
      study_hours: getNumberValue("study_hours"),
      attendance: getNumberValue("attendance"),
      previous_score: getNumberValue("previous_score"),
      assignment_score: getNumberValue("assignment_score"),
      sleep_hours: getNumberValue("sleep_hours"),
    };

    if (
      !Number.isFinite(studentData.study_hours) ||
      !Number.isFinite(studentData.attendance) ||
      !Number.isFinite(studentData.previous_score) ||
      !Number.isFinite(studentData.assignment_score) ||
      !Number.isFinite(studentData.sleep_hours)
    ) {
      alert("Please enter all student details.");
      return;
    }

    predictButton.disabled = true;
    predictButton.textContent = "⏳ Predicting...";

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      const score = clamp(Number(result.predicted_score));

      updateScore(score);
      updateDashboard(studentData);
      generateSuggestions(studentData);

    } catch (error) {
      console.error(error);
      scoreMessageEl.textContent =
        "❌ Unable to connect to prediction API.";
    }

    predictButton.disabled = false;
    predictButton.textContent = "🎯 Predict Performance";
  });
}

if (resetButton) {
  resetButton.addEventListener("click", resetDashboard);
}

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

/* =========================================================
   NEW DASHBOARD ELEMENTS
========================================================= */

const predictionListEl =
  document.querySelector(".prediction-list");

const chartLineEl =
  document.querySelector(".chart-line");

const chartAreaEl =
  document.querySelector(".chart-area");

const chartCircles =
  document.querySelectorAll(".performance-line circle");

const currentScoreEl =
  document.querySelector(".mini-chart-footer div:nth-child(1) strong");

const bestScoreEl =
  document.querySelector(".mini-chart-footer div:nth-child(2) strong");

const averageScoreEl =
  document.querySelector(".mini-chart-footer div:nth-child(3) strong");

const miniStatCards =
  document.querySelectorAll(".mini-stat-card");


/* Keep recent prediction history */
let predictionHistory = [];



/* =========================================================
   ADD RECENT PREDICTION
========================================================= */

function addRecentPrediction(score) {

  if (!predictionListEl) return;

  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  let status = "Average";
  let statusClass = "warning";
  let icon = "📝";
  let iconClass = "orange";

  if (score >= 85) {

    status = "Excellent";
    statusClass = "good";
    icon = "🎯";
    iconClass = "purple";

  } else if (score >= 70) {

    status = "Good";
    statusClass = "average";
    icon = "📚";
    iconClass = "blue";

  }

  const prediction = {
    score,
    time,
    status,
    statusClass,
    icon,
    iconClass
  };

  predictionHistory.unshift(prediction);

  /* Keep only latest 4 */
  predictionHistory =
    predictionHistory.slice(0, 4);

  predictionListEl.innerHTML = "";

  predictionHistory.forEach((item) => {

    const row = document.createElement("div");

    row.className = "prediction-item";

    row.innerHTML = `
      <div class="prediction-icon ${item.iconClass}">
        ${item.icon}
      </div>

      <div class="prediction-info">
        <strong>Academic Performance</strong>
        <span>Just now • ${item.time}</span>
      </div>

      <div class="prediction-score">
        <strong>${item.score.toFixed(1)}</strong>
        <span>/100</span>
      </div>

      <div class="prediction-status ${item.statusClass}">
        ${item.status}
      </div>
    `;

    predictionListEl.appendChild(row);

  });

}


/* =========================================================
   UPDATE PERFORMANCE GRAPH
========================================================= */

function updatePerformanceGraph(score) {

 

  const scores =
    predictionHistory
      .map(item => item.score)
      .reverse();

  if (scores.length === 0) return;

  const points = [];

  const width = 500;
  const height = 140;

  scores.forEach((value, index) => {

    const x =
      scores.length === 1
        ? 250
        : (index / (scores.length - 1)) * width;

    const y =
      height - ((value / 100) * 110);

    points.push({
      x,
      y
    });

  });

  if (points.length === 1) {

    points.push({
      x: 500,
      y: points[0].y
    });

  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {

    const previous = points[i - 1];
    const current = points[i];

    const controlX =
      (previous.x + current.x) / 2;

    path += `
      C
      ${controlX} ${previous.y},
      ${controlX} ${current.y},
      ${current.x} ${current.y}
    `;

  }

if (chartLineEl) {
  chartLineEl.setAttribute("d", path);
}

if (chartAreaEl) {
  const areaPath =
    `${path}
     L ${points[points.length - 1].x} 180
     L 0 180
     Z`;

  chartAreaEl.setAttribute("d", areaPath);
}


  /* Update graph dots */

  chartCircles.forEach((circle, index) => {

    if (!points[index]) {

      circle.style.display = "none";
      return;

    }

    circle.style.display = "block";

    circle.setAttribute(
      "cx",
      points[index].x
    );

    circle.setAttribute(
      "cy",
      points[index].y
    );

  });


  /* Footer statistics */

  const maxScore =
    Math.max(...scores);

  const averageScore =
    scores.reduce(
      (sum, value) => sum + value,
      0
    ) / scores.length;

  if (currentScoreEl) {
    currentScoreEl.textContent =
      `${score.toFixed(1)}%`;
  }

  if (bestScoreEl) {
    bestScoreEl.textContent =
      `${maxScore.toFixed(1)}%`;
  }

  if (averageScoreEl) {
    averageScoreEl.textContent =
      `${averageScore.toFixed(1)}%`;
  }

}


/* =========================================================
   UPDATE MINI STAT CARDS
========================================================= */

function updateMiniStats(data, score) {

  if (!miniStatCards.length) return;

  const {
    study_hours,
    attendance
  } = data;


  /* Study consistency */

  const studyConsistency =
    clamp((study_hours / 10) * 100);


  /* Attendance */

  const attendanceScore =
    clamp(attendance);




  

/* Prediction confidence */

const confidence =
  Math.max(
    0,
    95 - Math.abs(score - 75) * 0.5
  );


  const values = [
    studyConsistency,
    attendanceScore,
    confidence
  ];


  miniStatCards.forEach((card, index) => {

    const value = values[index];

    const number =
       card.querySelector(":scope > strong");

    const progress =
      card.querySelector(".mini-progress div");

    if (number) {
      number.textContent =
        `${Math.round(value)}%`;
    }

    if (progress) {
      progress.style.width =
        `${value}%`;
    }

  });

}

function getNumberValue(id) {
  const input = document.getElementById(id);

  if (!input || input.value.trim() === "") {
    return NaN;
  }

  const num = Number(input.value);

  return Number.isFinite(num) ? num : NaN;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function setProgress(key, percent) {
  const p = progressMap[key];

  if (!p || !p.bar || !p.text) {
    return;
  }

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

    if (!suggestionsListEl) return;

    const {
        study_hours,
        attendance,
        assignment_score,
        sleep_hours
    } = data;

    const suggestions = [];

    // =====================================================
    // STUDY HOURS
    // =====================================================

    if (study_hours < 5) {

        suggestions.push({
            icon: "📚",
            text: "Try increasing your daily study time to at least 5 hours."
        });

    } else {

        suggestions.push({
            icon: "✅",
            text: "Your study hours are good. Maintain your current consistency."
        });

    }


    // =====================================================
    // ATTENDANCE
    // =====================================================

    if (attendance < 75) {

        suggestions.push({
            icon: "📅",
            text: "Improve attendance. Try to maintain at least 75% attendance."
        });

    } else if (attendance < 85) {

        suggestions.push({
            icon: "📈",
            text: "Your attendance is acceptable. Aim for 85% or higher."
        });

    } else {

        suggestions.push({
            icon: "🌟",
            text: "Excellent attendance. Keep it above 85%."
        });

    }


    // =====================================================
    // ASSIGNMENT
    // =====================================================

    if (assignment_score < 60) {

        suggestions.push({
            icon: "📝",
            text: "Spend more time on assignments to improve your score."
        });

    } else {

        suggestions.push({
            icon: "✅",
            text: "Good assignment performance. Continue submitting quality work."
        });

    }


    // =====================================================
    // SLEEP
    // =====================================================

    if (sleep_hours < 7) {

        suggestions.push({
            icon: "😴",
            text: "Try getting 7–8 hours of sleep for better concentration."
        });

    } else {

        suggestions.push({
            icon: "😴",
            text: "Your sleep duration is healthy for maintaining concentration."
        });

    }


    // =====================================================
    // DISPLAY SUGGESTIONS
    // =====================================================

    suggestionsListEl.innerHTML = "";

    for (const item of suggestions) {

        const div = document.createElement("div");

        div.className = "suggestion";

        div.innerHTML = `
            <span>${item.icon}</span>
            <p>${item.text}</p>
        `;

        suggestionsListEl.appendChild(div);
    }
}
function resetDashboard() {

  form.reset();

  scoreValueEl.textContent = "--";
  scoreCardEl.textContent = "--";
  studyCardEl.textContent = "--";
  attendanceCardEl.textContent = "--";
  sleepCardEl.textContent = "--";

  performanceLevelEl.textContent =
    "Waiting for prediction";

  performanceLevelEl.style.color = "";

  scoreMessageEl.textContent =
    "Enter student details and predict performance.";

  /* Reset score circle */
  if (scoreCircleEl) {
    scoreCircleEl.style.background =
      "conic-gradient(#6366f1 0deg, #edf0f6 0deg)";
  }

  /* Reset suggestions */
  if (suggestionsListEl) {
  suggestionsListEl.innerHTML = `
    <div class="suggestion">
      <span>💡</span>
      <p>Enter your details to receive personalized suggestions.</p>
    </div>
  `;
}

  /* Reset progress bars */
  for (const key of Object.keys(progressMap)) {
    setProgress(key, 0);
  }

  /* Reset prediction history */
  predictionHistory = [];

  /* Reset graph */
  /* Reset graph */

if (chartLineEl) {
  chartLineEl.setAttribute(
    "d",
    "M0 140 L500 140"
  );
}

if (chartAreaEl) {
  chartAreaEl.setAttribute(
    "d",
    "M0 140 L500 140 L500 180 L0 180 Z"
  );
}

  /* Hide graph dots */
  chartCircles.forEach(circle => {
    circle.style.display = "none";
  });

  /* Reset footer */
  if (currentScoreEl) {
    currentScoreEl.textContent = "--";
  }

  if (bestScoreEl) {
    bestScoreEl.textContent = "--";
  }

  if (averageScoreEl) {
    averageScoreEl.textContent = "--";
  }

  /* Reset mini stats */
  miniStatCards.forEach(card => {

    const number =
      card.querySelector(":scope > strong");

    const progress =
      card.querySelector(".mini-progress div");

    if (number) {
      number.textContent = "--";
    }

    if (progress) {
      progress.style.width = "0%";
    }

  });

}
/* ========================================
   USER PROFILE DROPDOWN
======================================== */

const userMenu = document.querySelector(".user-menu");
const userAvatarBtn = document.querySelector(".user-avatar-btn");

if (userMenu && userAvatarBtn) {

    // Open / Close dropdown
    userAvatarBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen = userMenu.classList.toggle("active");

        userAvatarBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });


    // Prevent dropdown click from closing
    const userDropdown =
        userMenu.querySelector(".user-dropdown");

    if (userDropdown) {

        userDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

    }


    // Click outside → close
    document.addEventListener("click", function (event) {

        if (!userMenu.contains(event.target)) {

            userMenu.classList.remove("active");

            userAvatarBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    });


    // ESC → close
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            userMenu.classList.remove("active");

            userAvatarBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }

    });

}
document.addEventListener("mousemove", function (event) {

    const x =
        (event.clientX / window.innerWidth) - 0.5;

    const y =
        (event.clientY / window.innerHeight) - 0.5;

    document.documentElement.style.setProperty(
        "--earth-x",
        `${x * 30}px`
    );

    document.documentElement.style.setProperty(
        "--earth-y",
        `${y * 22}px`
    );

    document.documentElement.style.setProperty(
        "--earth-rotate-y",
        `${x * 6}deg`
    );

    document.documentElement.style.setProperty(
        "--earth-rotate-x",
        `${-y * 6}deg`
    );

    const stars1 =
        document.querySelector(".stars-1");

    const stars2 =
        document.querySelector(".stars-2");

    const stars3 =
        document.querySelector(".stars-3");

    if (stars1) {
        stars1.style.transform =
            `translate(${x * 8}px, ${y * 8}px)`;
    }

    if (stars2) {
        stars2.style.transform =
            `translate(${x * 16}px, ${y * 16}px)`;
    }

    if (stars3) {
        stars3.style.transform =
            `translate(${x * 25}px, ${y * 25}px)`;
    }

});

/* =========================================================
   PREDICTION FORM SUBMIT
========================================================= */

if (form) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Get input values
    const data = {
      study_hours: getNumberValue("study_hours"),
      attendance: getNumberValue("attendance"),
      previous_score: getNumberValue("previous_score"),
      assignment_score: getNumberValue("assignment_score"),
      sleep_hours: getNumberValue("sleep_hours")
    };

    // Validate inputs
    if (
      !Number.isFinite(data.study_hours) ||
      !Number.isFinite(data.attendance) ||
      !Number.isFinite(data.previous_score) ||
      !Number.isFinite(data.assignment_score) ||
      !Number.isFinite(data.sleep_hours)
    ) {

      alert("Please fill all student details.");

      return;
    }

    // Validate ranges
    if (data.attendance < 0 || data.attendance > 100) {
      alert("Attendance must be between 0 and 100.");
      return;
    }

    if (data.previous_score < 0 || data.previous_score > 100) {
      alert("Previous score must be between 0 and 100.");
      return;
    }

    if (data.assignment_score < 0 || data.assignment_score > 100) {
      alert("Assignment score must be between 0 and 100.");
      return;
    }

    if (data.sleep_hours < 0 || data.sleep_hours > 24) {
      alert("Sleep hours must be between 0 and 24.");
      return;
    }

    // Disable button while predicting
    if (predictButton) {
      predictButton.disabled = true;
      predictButton.textContent = "⏳ Predicting...";
    }

    try {

      console.log("📤 Sending prediction:", data);

      const response = await fetch("/predict", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify(data)

      });

      console.log("📥 Response status:", response.status);

      const result = await response.json();

      console.log("📥 Prediction response:", result);

      // Handle API error
      if (!response.ok) {

        throw new Error(
          result.detail ||
          result.message ||
          "Prediction failed"
        );

      }

      // Get predicted score
      const score = Number(result.predicted_score);

      if (!Number.isFinite(score)) {
        throw new Error("Invalid prediction score received.");
      }

      // Update dashboard
      updateDashboard(data);

      updateScore(score);

      generateSuggestions(data);

      // Add recent prediction
      addRecentPrediction(score);

      // Update graph
      updatePerformanceGraph(score);

      // Update mini stats
      updateMiniStats(data, score);

      console.log("✅ Prediction successful:", score);

    } catch (error) {

      console.error("❌ Prediction error:", error);

      alert(
        "Prediction failed.\n\n" +
        error.message +
        "\n\nPlease try again."
      );

    } finally {

      // ALWAYS enable button again
      if (predictButton) {
        predictButton.disabled = false;
        predictButton.textContent = "🎯 Predict Performance";
      }

    }

  });

}


/* =========================================================
   RESET BUTTON
========================================================= */

if (resetButton) {

  resetButton.addEventListener("click", function () {

    resetDashboard();

  });

}
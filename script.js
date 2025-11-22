let timeLeft = 25 * 60;
let timerInterval = null;
let isRunning = false;
let currentMode = "work";

const workTime = 25 * 60;
const breakTime = 5 * 60;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const modeBtns = document.querySelectorAll(".mode-btn");
const countDisplay = document.getElementById("count");

const today = new Date().toDateString();
const savedDate = localStorage.getItem("session-date");

if (savedDate !== today) {
  localStorage.setItem("session-count", "0");
  localStorage.setItem("session-date", today);
}

let completedCount = parseInt(localStorage.getItem("session-count")) || 0;
countDisplay.textContent = completedCount;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  timerDisplay.textContent = display;
  document.title = isRunning ? `${display} - session` : "session Timer";
}

function startTimer() {
  isRunning = true;
  startBtn.textContent = "Pause";

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      finishTimer();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  startBtn.textContent = "Start";
  clearInterval(timerInterval);
  updateDisplay();
}

function finishTimer() {
  pauseTimer();
  playSound();

  if (currentMode === "work") {
    completedCount++;
    countDisplay.textContent = completedCount;
    localStorage.setItem("session-count", completedCount);
    alert("🎉 Work session complete! Take a break!");
  } else {
    alert("✅ Break over! Ready to work?");
  }
}

function resetTimer() {
  pauseTimer();
  timeLeft = currentMode === "work" ? workTime : breakTime;
  updateDisplay();
}

function playSound() {
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.frequency.value = 800;
  gain.gain.setValueAtTime(0.3, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.5);

  oscillator.start(audio.currentTime);
  oscillator.stop(audio.currentTime + 0.5);
}

startBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", resetTimer);

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isRunning && !confirm("Timer is running. Switch mode?")) {
      return;
    }

    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentMode = btn.dataset.mode;
    resetTimer();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }
});

let tasks = JSON.parse(localStorage.getItem("session-tasks")) || [];
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

function displayTasks() {
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty-message">No tasks yet!</p>';
    return;
  }

  taskList.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-item ${task.completed ? "completed" : ""}">
            <input 
                type="checkbox" 
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${
              task.id
            })">Delete</button>
        </div>
    `
    )
    .join("");
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    id: Date.now(),
    text: taskInput.value,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  displayTasks();
  taskInput.value = "";
});

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  displayTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  displayTasks();
}

function saveTasks() {
  localStorage.setItem("session-tasks", JSON.stringify(tasks));
}

updateDisplay();
displayTasks();

let timeLeft = 25 * 60; 
let timerInterval = null;
let isRunning = false;
let currentMode = 'work'; 
let sessionCount = 1;

let workDuration = 25;
let shortBreakDuration = 5;
let longBreakDuration = 15;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const sessionCountEl = document.getElementById('session-count');
const todayCountEl = document.getElementById('today-count');
const totalCountEl = document.getElementById('total-count');
const timerCard = document.querySelector('.timer-card');

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const workTimeEl = document.getElementById('work-time');
const breakTimeEl = document.getElementById('break-time');
const completedSessionsEl = document.getElementById('completed-sessions');

const workDurationInput = document.getElementById('work-duration');
const shortDurationInput = document.getElementById('short-duration');
const longDurationInput = document.getElementById('long-duration');
const soundToggle = document.getElementById('sound-toggle');

let tasks = JSON.parse(localStorage.getItem('session-tasks')) || [];
let stats = JSON.parse(localStorage.getItem('session-stats')) || {
    totalsessions: 0,
    todaysessions: 0,
    todayDate: new Date().toDateString(),
    workMinutes: 0,
    breakMinutes: 0
};

if (stats.todayDate !== new Date().toDateString()) {
    stats.todaysessions = 0;
    stats.todayDate = new Date().toDateString();
}

init();

function init() {
    displayTasks();
    updateStats();
    updateTimer();
    loadSettings();
}

startBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) {
            if (!confirm('Timer is running. Switch mode?')) return;
            pauseTimer();
        }
        
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        resetTimer();
    });
});

function startTimer() {
    isRunning = true;
    startBtn.textContent = 'Pause';
    startBtn.classList.add('pause');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft === 0) {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('pause');
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    
    if (currentMode === 'work') {
        timeLeft = workDuration * 60;
    } else if (currentMode === 'short') {
        timeLeft = shortBreakDuration * 60;
    } else {
        timeLeft = longBreakDuration * 60;
    }
    
    updateTimer();
}

function timerComplete() {
    pauseTimer();
    
    if (soundToggle.checked) {
        playSound();
    }
    
    timerCard.classList.add('pulse');
    setTimeout(() => timerCard.classList.remove('pulse'), 1500);
    
    if (currentMode === 'work') {
        stats.totalsessions++;
        stats.todaysessions++;
        stats.workMinutes += workDuration;
        
        if (sessionCount === 4) {
            sessionCount = 1;
            alert('Great work! Take a long break!');
            switchMode('long');
        } else {
            sessionCount++;
            alert('session complete! Take a short break.');
            switchMode('short');
        }
    } else {
        stats.breakMinutes += currentMode === 'short' ? shortBreakDuration : longBreakDuration;
        alert('Break over! Ready to work?');
        switchMode('work');
    }
    
    saveStats();
    updateStats();
    sessionCountEl.textContent = sessionCount;
}

function switchMode(mode) {
    currentMode = mode;
    modeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    resetTimer();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playSound() {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        text: taskInput.value,
        completed: false,
        sessions: 0
    };
    
    tasks.push(task);
    saveTasks();
    displayTasks();
    taskInput.value = '';
});

function displayTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-message">No tasks yet. Add one above!</p>';
        return;
    }
    
    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <span class="task-sessions">${task.sessions} </span>
            <button class="task-delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    
    if (task.completed && currentMode === 'work') {
        task.sessions++;
    }
    
    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    displayTasks();
}

function updateStats() {
    todayCountEl.textContent = stats.todaysessions;
    totalCountEl.textContent = stats.totalsessions;
    
    const workHours = Math.floor(stats.workMinutes / 60);
    const workMins = stats.workMinutes % 60;
    workTimeEl.textContent = `${workHours}h ${workMins}m`;
    
    const breakHours = Math.floor(stats.breakMinutes / 60);
    const breakMins = stats.breakMinutes % 60;
    breakTimeEl.textContent = `${breakHours}h ${breakMins}m`;
    
    completedSessionsEl.textContent = stats.totalsessions;
}

workDurationInput.addEventListener('change', () => {
    workDuration = parseInt(workDurationInput.value);
    if (currentMode === 'work') resetTimer();
    saveSettings();
});

shortDurationInput.addEventListener('change', () => {
    shortBreakDuration = parseInt(shortDurationInput.value);
    if (currentMode === 'short') resetTimer();
    saveSettings();
});

longDurationInput.addEventListener('change', () => {
    longBreakDuration = parseInt(longDurationInput.value);
    if (currentMode === 'long') resetTimer();
    saveSettings();
});

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('session-settings')) || {};
    
    if (settings.workDuration) {
        workDuration = settings.workDuration;
        workDurationInput.value = workDuration;
    }
    if (settings.shortBreakDuration) {
        shortBreakDuration = settings.shortBreakDuration;
        shortDurationInput.value = shortBreakDuration;
    }
    if (settings.longBreakDuration) {
        longBreakDuration = settings.longBreakDuration;
        longDurationInput.value = longBreakDuration;
    }
}

function saveSettings() {
    const settings = {
        workDuration,
        shortBreakDuration,
        longBreakDuration
    };
    localStorage.setItem('session-settings', JSON.stringify(settings));
}

function saveTasks() {
    localStorage.setItem('session-tasks', JSON.stringify(tasks));
}

function saveStats() {
    localStorage.setItem('session-stats', JSON.stringify(stats));
}
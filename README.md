# 🍅 Productivity Tracker

A simple Pomodoro timer with task management to boost your productivity and maintain focus.  
Built with **HTML**, **CSS**, and **JavaScript** — no frameworks, no dependencies.

---

## 🌐 Live Demo

`https://naderfkihhassen.github.io/productivity-tracker/`

---

## ✨ Features

### ✔ Pomodoro Timer
- **25-minute** work sessions
- **5-minute** break sessions
- Visual countdown timer display
- Start, pause, and reset controls
- Sound notification when timer completes

### ✔ Session Tracking
- Counts completed work sessions
- Daily session counter
- Resets automatically each day
- Persistent data across browser sessions

### ✔ Task Management
- Add tasks with descriptions
- Mark tasks as complete
- Delete tasks
- Track what you're working on
- Saves tasks to localStorage

### ✔ Mode Switching
- Quick toggle between Work and Break modes
- Active mode highlighted
- Timer adjusts automatically
- Confirmation when switching during active timer

### ✔ Keyboard Shortcuts
- **Space bar** - Start/Pause timer
- Works when not typing in input fields

### ✔ Tab Title Updates
- See timer countdown in browser tab
- Easy to track time even when browsing other tabs

### ✔ Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly interface
- Clean, distraction-free layout

---

## 🛠️ Tech Stack

- **HTML5** - Semantic structure and forms
- **CSS3** - Modern layout with Flexbox, Grid, and animations
- **JavaScript (ES6+)** - Timer logic, DOM manipulation, localStorage
- **Web Audio API** - Sound notifications
- **No external libraries** - Pure vanilla JavaScript

---

## 🚀 Getting Started

### Clone the repository
```bash
git clone https://github.com/naderfkihhassen/productivity-tracker.git
cd productivity-tracker
```

### Open in browser
Simply open `index.html` in your web browser.

**Or use a local server:**
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

Then navigate to `http://localhost:8000`

---

## 📖 Usage

### Using the Timer

1. **Start a session:**
   - Click the **"Start"** button or press **Space bar**
   - Timer begins counting down from 25:00

2. **Pause the timer:**
   - Click **"Pause"** button or press **Space bar**
   - Timer stops at current time

3. **Reset the timer:**
   - Click **"Reset"** button
   - Timer returns to 25:00 (or 5:00 for breaks)

4. **When timer completes:**
   - Sound notification plays
   - Alert message appears
   - Completed session counter increases (for work sessions)

### Switching Modes

- **Work Mode** - 25 minutes for focused work
- **Break Mode** - 5 minutes for rest

Click the mode buttons to switch. If timer is running, you'll get a confirmation prompt.

### Managing Tasks

1. **Add a task:**
   - Type task description in input field
   - Click **"Add"** button or press Enter
   - Task appears in the list below

2. **Complete a task:**
   - Check the checkbox next to the task
   - Task gets strikethrough styling

3. **Delete a task:**
   - Click the **"Delete"** button on the task

---

## 📁 Project Structure

```
productivity-tracker/
│
├── index.html          # Main HTML structure
├── style.css           # All styles and responsive design
├── script.js           # Timer logic and functionality
└── README.md           # Project documentation
```

---

## 🎨 Customization

### Change Timer Durations

Edit the constants in `script.js`:
```javascript
const workTime = 25 * 60;    // Work time in seconds (25 minutes)
const breakTime = 5 * 60;    // Break time in seconds (5 minutes)
```

### Change Color Scheme

Edit the CSS in `style.css`:
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-start {
  background: #10b981;  /* Start button color */
}

.mode-btn.active {
  background: #667eea;  /* Active mode color */
}
```

### Modify Sound Notification

Change the beep frequency in `script.js`:
```javascript
oscillator.frequency.value = 800;  // Higher = higher pitch
```

Or disable sound completely by commenting out the `playSound()` call in `finishTimer()`.

---

## 🔑 Key Concepts

### The Pomodoro Technique

The Pomodoro Technique is a time management method:
1. Work for 25 minutes (1 Pomodoro)
2. Take a 5-minute break
3. After 4 Pomodoros, take a longer break (15-30 minutes)

Benefits:
- Improves focus and concentration
- Reduces mental fatigue
- Maintains motivation
- Tracks time spent on tasks

### setInterval for Countdown

```javascript
timerInterval = setInterval(() => {
    timeLeft--;          // Decrease by 1 second
    updateDisplay();     // Update the UI
    
    if (timeLeft === 0) {
        finishTimer();   // Timer complete
    }
}, 1000);  // Run every 1000ms (1 second)
```

### Time Formatting

Converting seconds to MM:SS format:
```javascript
const minutes = Math.floor(timeLeft / 60);  // Get minutes
const seconds = timeLeft % 60;               // Get remaining seconds
const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// Result: "25:00", "04:35", etc.
```

### Web Audio API

Creating a simple beep sound:
```javascript
const audio = new AudioContext();
const oscillator = audio.createOscillator();
oscillator.frequency.value = 800;  // Frequency in Hz
oscillator.start();
oscillator.stop(audio.currentTime + 0.5);  // Play for 0.5 seconds
```

---

## 📊 Data Storage

### localStorage Structure
```json
{
  "session-count": "12",
  "pomodoro-date": "Mon Nov 25 2024",
  "pomodoro-tasks": [
    {
      "id": 1699564820000,
      "text": "Complete project documentation",
      "completed": false
    }
  ]
}
```

### Daily Reset
The session counter automatically resets to 0 each day. The app checks if the saved date matches today's date when loading.

---

## 🐛 Known Limitations

- No long break after 4 sessions (simplified version)
- Sound requires user interaction first (browser security)
- Data is device-specific (not synced across devices)
- No detailed statistics or charts
- Timer continues in background but may be throttled by browser

---

## 🚀 Future Enhancements

- [ ] Long break after 4 sessions
- [ ] Customizable timer durations in settings
- [ ] Detailed statistics (total time worked, sessions per day)
- [ ] Charts showing productivity over time
- [ ] Custom sound uploads
- [ ] Dark mode toggle
- [ ] Browser notifications
- [ ] Task categories and priorities
- [ ] Export data to CSV
- [ ] Sync across devices

---

## 💡 Tips for Using Pomodoro

1. **Plan your tasks** - Write down what you'll work on before starting
2. **Minimize distractions** - Close unnecessary tabs and apps
3. **Take real breaks** - Step away from your desk during breaks
4. **Track progress** - Review completed sessions at end of day
5. **Adjust as needed** - The timer is a tool, not a strict rule

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---



## 👤 Author

**Nader Fkih Hassen**
- GitHub: [@naderfkihhassen](https://github.com/naderfkihhassen)
- LinkedIn: [Nader Fkih Hassen](https://linkedin.com/in/nader-fkih-hassen)
- Portfolio: [naderfkihhassen.github.io/Portfolio](https://naderfkihhassen.github.io/Portfolio/)

---

## 🙏 Acknowledgments

- Built as a learning project for JavaScript timers and localStorage
- Inspired by the Pomodoro Technique by Francesco Cirillo
- No external libraries used — pure vanilla JavaScript

---

## 📞 Support

Found a bug or have a suggestion? Please [open an issue](https://github.com/naderfkihhassen/productivity-tracker/issues).

---

⭐ **If this project helped you stay focused, please give it a star!**

**Made with ❤️ and JavaScript**
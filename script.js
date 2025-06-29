class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60;  // 25分
        this.breakTime = 5 * 60;   // 5分
        this.isWorking = true;
        this.isRunning = false;
        this.interval = null;
        this.timeLeft = this.workTime;

        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timer');
        this.startButton = document.getElementById('start');
        this.stopButton = document.getElementById('stop');
        this.resetButton = document.getElementById('reset');
        this.workTimeInput = document.getElementById('work-time');
        this.breakTimeInput = document.getElementById('break-time');
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.stopButton.addEventListener('click', () => this.stop());
        this.resetButton.addEventListener('click', () => this.reset());
        this.workTimeInput.addEventListener('change', () => this.updateWorkTime());
        this.breakTimeInput.addEventListener('change', () => this.updateBreakTime());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => this.tick(), 1000);
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
        }
    }

    reset() {
        this.stop();
        this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
        this.updateDisplay();
    }

    updateWorkTime() {
        const minutes = parseInt(this.workTimeInput.value) || 25;
        this.workTime = minutes * 60;
        if (!this.isRunning && this.isWorking) {
            this.timeLeft = this.workTime;
            this.updateDisplay();
        }
    }

    updateBreakTime() {
        const minutes = parseInt(this.breakTimeInput.value) || 5;
        this.breakTime = minutes * 60;
        if (!this.isRunning && !this.isWorking) {
            this.timeLeft = this.breakTime;
            this.updateDisplay();
        }
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            // 時間が終了した場合
            this.stop();
            this.isWorking = !this.isWorking;  // 作業と休憩を切り替え
            this.timeLeft = this.isWorking ? this.workTime : this.breakTime;
            this.updateDisplay();
            this.notify();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    notify() {
        // ブラウザの通知機能を使用
        if (Notification.permission === 'granted') {
            new Notification(this.isWorking ? '作業時間開始' : '休憩時間開始');
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(this.isWorking ? '作業時間開始' : '休憩時間開始');
                }
            });
        }
    }
}

// ページ読み込み時にタイマーを初期化
window.addEventListener('load', () => {
    new PomodoroTimer();
});

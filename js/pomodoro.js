// pomodoro.js
export function renderPomodoro(container) {
  // Helper to render the Pomodoro UI with correct language
  function render(lang) {
    container.innerHTML = '';
    const labels = {
      fa: { start: 'شروع', stop: 'توقف', reset: 'ریست', title: 'تایمر پومودورو' },
      en: { start: 'Start', stop: 'Stop', reset: 'Reset', title: 'Pomodoro Timer' }
    };
    const title = document.createElement('h3');
    title.textContent = labels[lang].title;
    container.appendChild(title);
    const timer = document.createElement('div');
    timer.style.fontSize = '2em';
    timer.style.textAlign = 'center';
    timer.style.margin = '12px 0';
    container.appendChild(timer);
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.justifyContent = 'center';
    controls.style.gap = '8px';
    const startBtn = document.createElement('button');
    startBtn.textContent = labels[lang].start;
    const stopBtn = document.createElement('button');
    stopBtn.textContent = labels[lang].stop;
    const resetBtn = document.createElement('button');
    resetBtn.textContent = labels[lang].reset;
    controls.appendChild(startBtn);
    controls.appendChild(stopBtn);
    controls.appendChild(resetBtn);
    container.appendChild(controls);
    let interval = null;
    let remain = 25 * 60;
    let paused = false;
    const pomodoroBeep = new Audio(chrome.runtime.getURL('js/beep.mp3'));
    function updateUI(newRemain) {
      remain = newRemain;
      const m = Math.floor(remain / 60).toString().padStart(2, '0');
      const s = (remain % 60).toString().padStart(2, '0');
      timer.textContent = `${m}:${s}`;
    }
    function setStopBtnText() {
      if (paused) {
        stopBtn.textContent = lang === 'fa' ? 'ادامه' : 'Continue';
      } else {
        stopBtn.textContent = labels[lang].stop;
      }
    }
    function poll() {
      if (paused) return;
      chrome.runtime.sendMessage({ type: 'GET_POMODORO_END' }, res => {
        if (chrome.runtime.lastError) {
          if (interval) clearInterval(interval);
          interval = null;
          timer.textContent = '⛔️';
          return;
        }
        if (res && res.endTime) {
          const newRemain = Math.max(0, Math.floor((res.endTime - Date.now()) / 1000));
          updateUI(newRemain);
          if (newRemain === 0) {
            clearInterval(interval);
            interval = null;
            pomodoroBeep.play();
            setTimeout(() => {
              updateUI(25 * 60);
              remain = 25 * 60;
            }, 1000);
          }
        } else {
          updateUI(remain);
        }
      });
    }
    function start() {
      if (paused) {
        chrome.runtime.sendMessage({ type: 'START_POMODORO', remain }, res => {
          paused = false;
          setStopBtnText();
          poll();
          if (interval) clearInterval(interval);
          interval = setInterval(poll, 1000);
        });
      } else {
        chrome.runtime.sendMessage({ type: 'START_POMODORO' }, res => {
          poll();
          if (interval) clearInterval(interval);
          interval = setInterval(poll, 1000);
        });
      }
    }
    function stopOrContinue() {
      if (!paused) {
        paused = true;
        if (interval) clearInterval(interval);
        interval = null;
        updateUI(remain);
        chrome.runtime.sendMessage({ type: 'PAUSE_POMODORO', remain });
        setStopBtnText();
      } else {
        start();
      }
    }
    function reset() {
      paused = false;
      remain = 25 * 60;
      if (interval) clearInterval(interval);
      interval = null;
      updateUI(remain);
      chrome.runtime.sendMessage({ type: 'STOP_POMODORO' });
      setStopBtnText();
    }
    startBtn.onclick = start;
    stopBtn.onclick = stopOrContinue;
    resetBtn.onclick = reset;
    setStopBtnText();
    poll();
    if (!interval) interval = setInterval(poll, 1000);
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }
  // Detect language and render
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['lang'], (res) => {
      const lang = res.lang || 'fa';
      render(lang);
    });
  } else {
    render('fa');
  }
} 
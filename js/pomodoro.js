// pomodoro.js
export function renderPomodoro(container) {
  // Helper to render the Pomodoro UI with correct language
  function render(lang) {
    container.innerHTML = '';
    const labels = {
      fa: { start: 'شروع', stop: 'توقف', reset: 'ریست', title: 'تایمر پومودورو', cycles: 'تعداد سیکل امروز: ' },
      en: { start: 'Start', stop: 'Stop', reset: 'Reset', title: 'Pomodoro Timer', cycles: 'Cycles today: ' }
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
    const cycleDiv = document.createElement('div');
    cycleDiv.style.textAlign = 'center';
    cycleDiv.style.marginTop = '8px';
    container.appendChild(cycleDiv);
    let interval = null, cycles = 0;
    const pomodoroBeep = new Audio(chrome.runtime.getURL('js/beep.mp3'));
    function updateUI(remain) {
      const m = Math.floor(remain / 60).toString().padStart(2, '0');
      const s = (remain % 60).toString().padStart(2, '0');
      timer.textContent = `${m}:${s}`;
      cycleDiv.textContent = labels[lang].cycles + cycles;
    }
    function poll() {
      chrome.runtime.sendMessage({ type: 'GET_POMODORO_END' }, res => {
        if (chrome.runtime.lastError) {
          if (interval) clearInterval(interval);
          interval = null;
          timer.textContent = '⛔️';
          cycleDiv.textContent = lang === 'fa' ? 'ارتباط با پس‌زمینه قطع است' : 'Background not available';
          return;
        }
        if (res && res.endTime) {
          const remain = Math.max(0, Math.floor((res.endTime - Date.now()) / 1000));
          updateUI(remain);
          if (remain === 0) {
            clearInterval(interval);
            interval = null;
            pomodoroBeep.play();
            setTimeout(() => updateUI(25 * 60), 1000);
          }
        } else {
          updateUI(25 * 60);
        }
      });
    }
    function start() {
      chrome.runtime.sendMessage({ type: 'START_POMODORO' }, res => {
        poll();
        if (interval) clearInterval(interval);
        interval = setInterval(poll, 1000);
      });
    }
    function stop() {
      chrome.runtime.sendMessage({ type: 'STOP_POMODORO' }, res => {
        if (interval) clearInterval(interval);
        interval = null;
        updateUI(25 * 60);
      });
    }
    function reset() {
      stop();
    }
    startBtn.onclick = start;
    stopBtn.onclick = stop;
    resetBtn.onclick = reset;
    // هر بار popup باز شد، وضعیت تایمر را چک کن
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
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
    let work = 25 * 60, rest = 5 * 60;
    let isWork = true, time = work, interval = null, cycles = 0;
    const pomodoroBeep = new Audio(chrome.runtime.getURL('js/beep.mp3'));
    function update() {
      const m = Math.floor(time / 60).toString().padStart(2, '0');
      const s = (time % 60).toString().padStart(2, '0');
      timer.textContent = `${m}:${s}`;
      cycleDiv.textContent = labels[lang].cycles + cycles;
    }
    function start() {
      if (interval) return;
      interval = setInterval(() => {
        time--;
        update();
        if (time <= 0) {
          clearInterval(interval);
          interval = null;
          isWork = !isWork;
          time = isWork ? work : rest;
          if (!isWork) cycles++;
          update();
          pomodoroBeep.play();
          if (Notification && Notification.permission === 'granted') {
            new Notification(labels[lang].title, { body: isWork ? (lang === 'fa' ? 'زمان کار!' : 'Work time!') : (lang === 'fa' ? 'زمان استراحت!' : 'Break time!') });
          }
        }
      }, 1000);
    }
    function stop() {
      clearInterval(interval);
      interval = null;
    }
    function reset() {
      stop();
      isWork = true;
      time = work;
      update();
    }
    startBtn.onclick = start;
    stopBtn.onclick = stop;
    resetBtn.onclick = reset;
    update();
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
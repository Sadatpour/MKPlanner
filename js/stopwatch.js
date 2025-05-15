// stopwatch.js
export function renderStopwatch(container) {
  container.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'کرنومتر';
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
  startBtn.textContent = 'شروع';
  const stopBtn = document.createElement('button');
  stopBtn.textContent = 'توقف';
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'ریست';
  controls.appendChild(startBtn);
  controls.appendChild(stopBtn);
  controls.appendChild(resetBtn);
  container.appendChild(controls);
  let time = 0, interval = null;
  function update() {
    const m = Math.floor(time / 60).toString().padStart(2, '0');
    const s = (time % 60).toString().padStart(2, '0');
    timer.textContent = `${m}:${s}`;
  }
  function start() {
    if (interval) return;
    interval = setInterval(() => {
      time++;
      update();
    }, 1000);
  }
  function stop() {
    clearInterval(interval);
    interval = null;
  }
  function reset() {
    stop();
    time = 0;
    update();
  }
  startBtn.onclick = start;
  stopBtn.onclick = stop;
  resetBtn.onclick = reset;
  update();
} 
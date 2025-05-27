// pomodoro.js
export function renderPomodoro(container) {
  // Helper to render the Pomodoro UI with correct language
  function render(lang) {
    container.innerHTML = '';
    const labels = {
      fa: { start: 'شروع', stop: 'توقف', reset: 'ریست', title: 'تایمر پومودورو' },
      en: { start: 'Start', stop: 'Stop', reset: 'Reset', title: 'Pomodoro Timer' }
    };
    const titleBar = document.createElement('div');
    titleBar.style.display = 'flex';
    titleBar.style.alignItems = 'center';
    titleBar.style.justifyContent = 'space-between';
    const title = document.createElement('h3');
    title.textContent = labels[lang].title;
    title.style.margin = 0;
    titleBar.appendChild(title);
    container.appendChild(titleBar);
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
    // --- سورپرایزها ---
    const motivationalQuotesFa = [
      'تو می‌تونی! فقط ادامه بده.',
      'هر روز یک قدم به جلو!',
      'امروزت رو بساز، فردا خودش میاد.',
      'موفقیت از آن توست!',
      'هیچ چیز غیرممکن نیست.',
      'امروز بهترین فرصت برای شروعه.',
      'باور کن که می‌تونی!',
      'از شکست نترس، تجربه‌ست.',
      'لبخند بزن و ادامه بده!',
      'تو قهرمانی!',
      'هر شکستی پلی برای پیروزیه.',
      'امروزت رو با امید شروع کن.',
      'به خودت ایمان داشته باش.',
      'تلاش امروز، موفقیت فرداست.',
      'هیچ‌وقت تسلیم نشو.',
      'تو از چیزی که فکر می‌کنی قوی‌تری.',
      'با هر لبخند، دنیا زیباتر میشه.',
      'قدم‌های کوچک، نتایج بزرگ.',
      'هر روز فرصت دوباره‌ایه.',
      'تو الهام‌بخش دیگرانی!'
    ];
    const motivationalQuotesEn = [
      'You can do it! Keep going.',
      'Every day is a new chance.',
      'Small steps make big changes.',
      'Success is yours!',
      'Nothing is impossible.',
      'Today is the best day to start.',
      'Believe in yourself!',
      "Don't fear failure, it's experience.",
      'Smile and move on!',
      'You are a champion!',
      'Every setback is a setup for a comeback.',
      'Start your day with hope.',
      'Trust yourself and your journey.',
      'Today's effort is tomorrow's success.',
      'Never give up.',
      'You are stronger than you think.',
      'A smile makes the world brighter.',
      'Little steps, big results.',
      'Each day is a new opportunity.',
      'You inspire others!'
    ];
    // مجموعه گرادینت‌های رنگی جذاب
    const gradients = [
      'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)',
      'linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(120deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(120deg, #5ee7df 0%, #b490ca 100%)',
      'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
      'linear-gradient(120deg, #f857a6 0%, #ff5858 100%)',
      'linear-gradient(120deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
      'linear-gradient(120deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(120deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)'
    ];
    // مجموعه ایموجی‌های متنوع و ترکیبی
    const emojiSets = [
      ['😂','🤣','😜','😎','🤩','🥳','😺','🙃','😻','😆'],
      ['🍕','🍔','🍟','🌭','🍿','🍩','🍦','🍫','🍬','🍭'],
      ['🌈','☀️','🌤️','⛅','🌦️','🌧️','🌩️','❄️','🌪️','🌟'],
      ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯'],
      ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚚'],
      ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸'],
      ['🎉','🎊','🎈','🎂','🎁','🥳','🪅','🪩','🪄','🎆'],
      ['👾','🤖','👽','👻','💀','🦄','🐲','🦖','🦕','🧙‍♂️'],
      ['💖','💙','💚','💛','💜','🧡','🖤','🤍','🤎','❤️'],
      ['🍀','🌸','🌻','🌼','🌹','🌷','🌺','🌵','🌳','🌲']
    ];
    function rainEmojis() {
      const emojis = emojiSets[Math.floor(Math.random() * emojiSets.length)];
      const rainContainer = document.createElement('div');
      rainContainer.style.position = 'fixed';
      rainContainer.style.left = 0;
      rainContainer.style.top = 0;
      rainContainer.style.width = '100vw';
      rainContainer.style.height = '100vh';
      rainContainer.style.pointerEvents = 'none';
      rainContainer.style.zIndex = 9999;
      document.body.appendChild(rainContainer);
      for (let i = 0; i < 30; i++) {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.top = '-2em';
        emoji.style.fontSize = (2 + Math.random() * 2) + 'em';
        emoji.style.transition = 'top 1.5s linear';
        rainContainer.appendChild(emoji);
        setTimeout(() => {
          emoji.style.top = '90vh';
        }, 50 + Math.random() * 200);
      }
      setTimeout(() => {
        rainContainer.remove();
      }, 1800);
    }
    function showMotivationalQuote() {
      let quotes = lang === 'fa' ? motivationalQuotesFa : motivationalQuotesEn;
      // جلوگیری از تکرار پشت سر هم
      if (!showMotivationalQuote.lastIdxs) showMotivationalQuote.lastIdxs = { fa: -1, en: -1 };
      let idx;
      do {
        idx = Math.floor(Math.random() * quotes.length);
      } while (idx === showMotivationalQuote.lastIdxs[lang] && quotes.length > 1);
      showMotivationalQuote.lastIdxs[lang] = idx;
      const quote = quotes[idx];
      const quoteDiv = document.createElement('div');
      quoteDiv.textContent = quote;
      quoteDiv.style.position = 'fixed';
      quoteDiv.style.left = '50%';
      quoteDiv.style.top = '50%';
      quoteDiv.style.transform = 'translate(-50%, -50%)';
      quoteDiv.style.background = gradients[Math.floor(Math.random() * gradients.length)];
      quoteDiv.style.color = '#fff';
      quoteDiv.style.fontSize = '2.1em';
      quoteDiv.style.padding = '36px 48px';
      quoteDiv.style.borderRadius = '28px';
      quoteDiv.style.boxShadow = '0 8px 32px #0004';
      quoteDiv.style.zIndex = 9999;
      quoteDiv.style.textAlign = 'center';
      quoteDiv.style.cursor = 'pointer';
      quoteDiv.style.maxWidth = '90vw';
      quoteDiv.style.userSelect = 'none';
      quoteDiv.style.lineHeight = '1.6';
      quoteDiv.title = lang === 'fa' ? 'برای بستن کلیک کن' : 'Click to close';
      document.body.appendChild(quoteDiv);
      quoteDiv.onclick = () => {
        quoteDiv.style.opacity = 0;
        setTimeout(() => quoteDiv.remove(), 400);
      };
    }
    function rainbowBackground() {
      let idx;
      do {
        idx = Math.floor(Math.random() * gradients.length);
      } while (rainbowBackground.lastIdx === idx && gradients.length > 1);
      rainbowBackground.lastIdx = idx;
      const grad = gradients[idx];
      const origBg = document.body.style.background;
      document.body.style.transition = 'background 0.7s';
      document.body.style.background = grad;
      setTimeout(() => {
        document.body.style.background = origBg;
      }, 1500);
    }
    let lastSurprise = -1;
    window.surpriseUser = function() {
      let idx;
      do {
        idx = Math.floor(Math.random() * 3);
      } while (idx === lastSurprise);
      lastSurprise = idx;
      if (idx === 0) rainEmojis();
      else if (idx === 1) showMotivationalQuote();
      else rainbowBackground();
    };
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
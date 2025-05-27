// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Moji Planner Installed');
});

// --- Pomodoro Timer Logic in Background ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "START_POMODORO") {
    let endTime;
    if (typeof msg.remain === 'number' && msg.remain > 0) {
      endTime = Date.now() + msg.remain * 1000;
      chrome.storage.local.remove("pomodoroRemain", () => {
        chrome.storage.local.set({ pomodoroEnd: endTime }, () => {
          chrome.alarms.create("pomodoro", { when: endTime });
          sendResponse({ status: "started", endTime });
        });
      });
      return true;
    } else {
      endTime = Date.now() + 25 * 60 * 1000;
      chrome.storage.local.set({ pomodoroEnd: endTime }, () => {
        chrome.alarms.create("pomodoro", { when: endTime });
        sendResponse({ status: "started", endTime });
      });
      return true;
    }
  }
  if (msg.type === "STOP_POMODORO") {
    chrome.alarms.clear("pomodoro");
    chrome.storage.local.remove("pomodoroEnd", () => {
      sendResponse({ status: "stopped" });
    });
    return true;
  }
  if (msg.type === "PAUSE_POMODORO") {
    chrome.alarms.clear("pomodoro");
    chrome.storage.local.remove("pomodoroEnd", () => {
      chrome.storage.local.set({ pomodoroRemain: msg.remain }, () => {
        sendResponse({ status: "paused" });
      });
    });
    return true;
  }
  if (msg.type === "GET_POMODORO_END") {
    chrome.storage.local.get(["pomodoroEnd", "pomodoroRemain"], data => {
      if (data.pomodoroEnd) {
        sendResponse({ endTime: data.pomodoroEnd });
      } else if (typeof data.pomodoroRemain === 'number') {
        sendResponse({ endTime: Date.now() + data.pomodoroRemain * 1000 });
      } else {
        sendResponse({ endTime: null });
      }
    });
    return true;
  }
  if (msg.type === "GET_POMODORO_CYCLES") {
    return true;
  }
});

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `pomodoroCycles_${y}-${m}-${day}`;
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "pomodoro") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "پومودورو تمام شد!",
      message: "۲۵ دقیقه به پایان رسید. استراحت کن :)"
    });
    chrome.storage.local.remove("pomodoroEnd");
    chrome.storage.local.remove("pomodoroRemain");
  }
}); 
// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Moji Planner Installed');
});

// --- Pomodoro Timer Logic in Background ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "START_POMODORO") {
    const endTime = Date.now() + 25 * 60 * 1000;
    chrome.storage.local.set({ pomodoroEnd: endTime }, () => {
      chrome.alarms.create("pomodoro", { when: endTime });
      sendResponse({ status: "started", endTime });
    });
    return true;
  }
  if (msg.type === "STOP_POMODORO") {
    chrome.alarms.clear("pomodoro");
    chrome.storage.local.remove("pomodoroEnd", () => {
      sendResponse({ status: "stopped" });
    });
    return true;
  }
  if (msg.type === "GET_POMODORO_END") {
    chrome.storage.local.get("pomodoroEnd", data => {
      sendResponse({ endTime: data.pomodoroEnd });
    });
    return true;
  }
  if (msg.type === "GET_POMODORO_CYCLES") {
    const todayKey = getTodayKey();
    chrome.storage.local.get([todayKey], data => {
      sendResponse({ cycles: data[todayKey] || 0 });
    });
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
    const todayKey = getTodayKey();
    chrome.storage.local.get([todayKey], data => {
      const cycles = (data[todayKey] || 0) + 1;
      chrome.storage.local.set({ [todayKey]: cycles });
    });
    chrome.storage.local.remove("pomodoroEnd");
  }
}); 
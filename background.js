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
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "pomodoro") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "پومودورو تمام شد!",
      message: "۲۵ دقیقه به پایان رسید. استراحت کن :)"
    });
    chrome.storage.local.remove("pomodoroEnd");
  }
}); 
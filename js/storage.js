// storage.js
export function saveData(key, value) {
  chrome.storage.sync.set({ [key]: value });
}

export function loadData(key, callback) {
  chrome.storage.sync.get([key], (result) => {
    callback(result[key]);
  });
}

export function getTasks(callback) {
  chrome.storage.sync.get(['tasks'], (result) => {
    callback(result.tasks || []);
  });
}

export function setTasks(tasks, callback) {
  chrome.storage.sync.set({ tasks }, callback);
}

export function getTasksForDate(dateKey, callback) {
  chrome.storage.sync.get([dateKey], (result) => {
    callback(result[dateKey] || []);
  });
}

export function setTasksForDate(dateKey, tasks, callback) {
  chrome.storage.sync.set({ [dateKey]: tasks }, callback);
} 
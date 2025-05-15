// settings.js
export function renderSettings(container) {
  container.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'تنظیمات';
  container.appendChild(title);
  // Theme toggle
  const themeDiv = document.createElement('div');
  themeDiv.style.margin = '8px 0';
  const themeLabel = document.createElement('label');
  themeLabel.textContent = 'تم:';
  const themeSelect = document.createElement('select');
  themeSelect.innerHTML = '<option value="light">روشن</option><option value="dark">تاریک</option>';
  themeDiv.appendChild(themeLabel);
  themeDiv.appendChild(themeSelect);
  container.appendChild(themeDiv);
  // Language toggle
  const langDiv = document.createElement('div');
  langDiv.style.margin = '8px 0';
  const langLabel = document.createElement('label');
  langLabel.textContent = 'زبان:';
  const langSelect = document.createElement('select');
  langSelect.innerHTML = '<option value="fa">فارسی</option><option value="en">English</option>';
  langDiv.appendChild(langLabel);
  langDiv.appendChild(langSelect);
  container.appendChild(langDiv);
  // --- Background color pickers ---
  const bgDiv = document.createElement('div');
  bgDiv.style.margin = '8px 0';
  const bgLabel = document.createElement('label');
  bgLabel.textContent = 'رنگ پس‌زمینه لایت:';
  const bgInput = document.createElement('input');
  bgInput.type = 'color';
  bgInput.style.marginLeft = '8px';
  const bgDarkLabel = document.createElement('label');
  bgDarkLabel.textContent = 'رنگ پس‌زمینه دارک:';
  bgDarkLabel.style.marginLeft = '16px';
  const bgDarkInput = document.createElement('input');
  bgDarkInput.type = 'color';
  bgDarkInput.style.marginLeft = '8px';
  bgDiv.appendChild(bgLabel);
  bgDiv.appendChild(bgInput);
  bgDiv.appendChild(bgDarkLabel);
  bgDiv.appendChild(bgDarkInput);
  container.appendChild(bgDiv);
  // --- دکمه ثبت تغییرات ---
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'ثبت تغییرات';
  saveBtn.style.marginTop = '16px';
  saveBtn.className = 'neumorph-btn';
  container.appendChild(saveBtn);
  // پیام موفقیت
  const msg = document.createElement('div');
  msg.style.color = '#16a34a';
  msg.style.fontSize = '1em';
  msg.style.marginTop = '8px';
  msg.style.display = 'none';
  container.appendChild(msg);
  // Load and save
  chrome.storage.sync.get(['theme', 'lang', 'bgColorLight', 'bgColorDark'], (res) => {
    themeSelect.value = res.theme || 'light';
    langSelect.value = res.lang || 'fa';
    bgInput.value = res.bgColorLight || '#f5f6fa';
    bgDarkInput.value = res.bgColorDark || '#23272f';
    applyTheme(themeSelect.value, bgInput.value, bgDarkInput.value);
    applyLang(langSelect.value);
  });
  themeSelect.onchange = () => {
    chrome.storage.sync.set({ theme: themeSelect.value });
    chrome.storage.sync.get(['bgColorLight', 'bgColorDark'], (res) => {
      applyTheme(themeSelect.value, res.bgColorLight || '#f5f6fa', res.bgColorDark || '#23272f');
    });
  };
  langSelect.onchange = () => {
    chrome.storage.sync.set({ lang: langSelect.value });
    applyLang(langSelect.value);
  };
  bgInput.oninput = () => {
    chrome.storage.sync.set({ bgColorLight: bgInput.value });
    chrome.storage.sync.get(['theme', 'bgColorDark'], (res) => {
      applyTheme(res.theme || 'light', bgInput.value, res.bgColorDark || '#23272f');
    });
  };
  bgDarkInput.oninput = () => {
    chrome.storage.sync.set({ bgColorDark: bgDarkInput.value });
    chrome.storage.sync.get(['theme', 'bgColorLight'], (res) => {
      applyTheme(res.theme || 'light', res.bgColorLight || '#f5f6fa', bgDarkInput.value);
    });
  };
  saveBtn.onclick = () => {
    chrome.storage.sync.set({
      theme: themeSelect.value,
      lang: langSelect.value,
      bgColorLight: bgInput.value,
      bgColorDark: bgDarkInput.value
    }, () => {
      msg.textContent = 'تغییرات با موفقیت ذخیره شد!';
      msg.style.display = 'block';
      setTimeout(() => {
        msg.style.display = 'none';
        // بستن modal اگر وجود دارد
        const modal = document.getElementById('settings-modal');
        if (modal) modal.style.display = 'none';
      }, 900);
    });
  };
}
function applyTheme(theme, bgColorLight = '#f5f6fa', bgColorDark = '#23272f') {
  document.body.classList.toggle('dark', theme === 'dark');
  if (theme === 'dark') {
    document.body.style.background = bgColorDark;
  } else {
    document.body.style.background = bgColorLight;
  }
}
function applyLang(lang) {
  document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.body.style.fontFamily = lang === 'fa' ? 'Vazir, sans-serif' : 'sans-serif';
}
export function getTranslation(key, lang = 'fa') {
  try {
    const translations = require(`../i18n/${lang}.json`);
    return translations[key] || key;
  } catch (e) {
    return key;
  }
} 
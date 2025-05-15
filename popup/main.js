// main.js (neumorphic dashboard version)
// import { renderChecklist } from '../js/checklist.js';
import { renderPomodoro } from '../js/pomodoro.js';
import { renderStopwatch } from '../js/stopwatch.js';
import { toJalali, todayGregorian, getJalaliMonthName } from '../js/calendar.js';

// --- Theme & Language Switch ---
const themeSwitch = document.getElementById('theme-switch');
const langSwitch = document.getElementById('lang-switch');
// const settingsBtn = document.getElementById('settings-btn');
// const settingsModal = document.getElementById('settings-modal');
// const settingsContent = document.getElementById('settings-content');

function safeSetOnClick(el, fn) {
  if (el) el.onclick = fn;
}
function safeSetOnSubmit(el, fn) {
  if (el) el.onsubmit = fn;
}
function safeSetInnerHTML(el, html) {
  if (el) el.innerHTML = html;
}
function safeSetValue(el, value) {
  if (el) el.value = value;
}

function applyTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
}
function applyLang(lang) {
  document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';
  document.body.style.fontFamily = lang === 'fa' ? 'Vazir, sans-serif' : 'sans-serif';
  // تغییر تایتل‌ها بر اساس زبان
  const titles = [
    { id: '.section-title', fa: ['چک‌لیست','بوکمارک‌ها','بیتی از شاهنامه','مدیریت ارتباطات','پروژه‌ها','اهداف'], en: ['Checklist','Bookmarks','Shahnameh Verse','Contact Manager','Projects','Goals'] }
  ];
  const allTitles = document.querySelectorAll('.section-title');
  // Placeholder translations
  const placeholders = {
    checklist: { fa: 'کار جدید...', en: 'New task...' },
    project: { fa: 'پروژه جدید...', en: 'New project...' },
    target: { fa: 'هدف جدید...', en: 'New goal...' },
    contact_name: { fa: 'نام', en: 'Name' },
    contact_phone: { fa: 'شماره تماس', en: 'Phone number' },
    contact_unit: { fa: 'واحد', en: 'Unit' },
    bookmark_title: { fa: 'عنوان یا نام سایت', en: 'Title or site name' },
    bookmark_url: { fa: 'https://example.com', en: 'https://example.com' },
  };
  if (lang === 'en') {
    allTitles.forEach((el, i) => { el.innerText = titles[0].en[i] || el.innerText; });
    // تغییر عنوان تایمر پومودورو
    const pomoTitle = document.querySelector('#pomodoro-timer h3');
    if (pomoTitle) pomoTitle.innerText = 'Pomodoro Timer';
    // تغییر گزینه‌های روشن/تاریک
    if (themeSwitch) {
      themeSwitch.options[0].text = 'Light';
      themeSwitch.options[1].text = 'Dark';
    }
    // Checklist
    const checklistInput = document.getElementById('checklist-input');
    if (checklistInput) checklistInput.placeholder = placeholders.checklist.en;
    // Project
    const projectInput = document.getElementById('project-input');
    if (projectInput) projectInput.placeholder = placeholders.project.en;
    // Target
    const targetInput = document.getElementById('target-input');
    if (targetInput) targetInput.placeholder = placeholders.target.en;
    // Contact
    const contactName = document.getElementById('contact-name');
    if (contactName) contactName.placeholder = placeholders.contact_name.en;
    const contactPhone = document.getElementById('contact-phone');
    if (contactPhone) contactPhone.placeholder = placeholders.contact_phone.en;
    const contactUnit = document.getElementById('contact-unit');
    if (contactUnit) contactUnit.placeholder = placeholders.contact_unit.en;
    // Bookmark (static add form)
    const addBookmarkBtn = document.getElementById('add-bookmark-btn');
    if (addBookmarkBtn) addBookmarkBtn.textContent = 'Add Bookmark';
    // Bookmark (dynamic form)
    const bookmarkForms = document.querySelectorAll('form');
    bookmarkForms.forEach(form => {
      if (form.querySelector('input[type="url"]') && form.querySelector('input[type="text"]')) {
        const textInput = form.querySelector('input[type="text"]');
        const urlInput = form.querySelector('input[type="url"]');
        if (textInput && urlInput) {
          textInput.placeholder = placeholders.bookmark_title.en;
          urlInput.placeholder = placeholders.bookmark_url.en;
        }
      }
    });
    // Contact form button
    const contactFormBtn = document.querySelector('#add-contact-form button[type="submit"]');
    if (contactFormBtn) contactFormBtn.textContent = 'Add Contact';
  } else {
    allTitles.forEach((el, i) => { el.innerText = titles[0].fa[i] || el.innerText; });
    const pomoTitle = document.querySelector('#pomodoro-timer h3');
    if (pomoTitle) pomoTitle.innerText = 'تایمر پومودورو';
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
      themeSwitch.options[0].text = 'روشن';
      themeSwitch.options[1].text = 'تاریک';
    }
    // Checklist
    const checklistInput = document.getElementById('checklist-input');
    if (checklistInput) checklistInput.placeholder = placeholders.checklist.fa;
    // Project
    const projectInput = document.getElementById('project-input');
    if (projectInput) projectInput.placeholder = placeholders.project.fa;
    // Target
    const targetInput = document.getElementById('target-input');
    if (targetInput) targetInput.placeholder = placeholders.target.fa;
    // Contact
    const contactName = document.getElementById('contact-name');
    if (contactName) contactName.placeholder = placeholders.contact_name.fa;
    const contactPhone = document.getElementById('contact-phone');
    if (contactPhone) contactPhone.placeholder = placeholders.contact_phone.fa;
    const contactUnit = document.getElementById('contact-unit');
    if (contactUnit) contactUnit.placeholder = placeholders.contact_unit.fa;
    // Bookmark (static add form)
    const addBookmarkBtn = document.getElementById('add-bookmark-btn');
    if (addBookmarkBtn) addBookmarkBtn.textContent = 'افزودن بوکمارک';
    // Bookmark (dynamic form)
    const bookmarkForms = document.querySelectorAll('form');
    bookmarkForms.forEach(form => {
      if (form.querySelector('input[type="url"]') && form.querySelector('input[type="text"]')) {
        const textInput = form.querySelector('input[type="text"]');
        const urlInput = form.querySelector('input[type="url"]');
        if (textInput && urlInput) {
          textInput.placeholder = placeholders.bookmark_title.fa;
          urlInput.placeholder = placeholders.bookmark_url.fa;
        }
      }
    });
    // Contact form button
    const contactFormBtn = document.querySelector('#add-contact-form button[type="submit"]');
    if (contactFormBtn) contactFormBtn.textContent = 'افزودن مخاطب';
  }
}
chrome.storage.sync.get(['theme', 'lang'], (res) => {
  safeSetValue(themeSwitch, res.theme || 'light');
  safeSetValue(langSwitch, res.lang || 'fa');
  applyTheme(themeSwitch ? themeSwitch.value : 'light');
  applyLang(langSwitch ? langSwitch.value : 'fa');
  // متن زیر لوگو
  const credit = document.getElementById('credit-text');
  if (credit) {
    if ((res.lang || 'fa') === 'en') {
      credit.innerHTML = 'Made with <span style="color:#e11d48">&#10084;&#65039;</span> by Mojtaba Sadatpour';
    } else {
      credit.innerHTML = 'توسعه با <span style="color:#e11d48">&#10084;&#65039;</span> توسط مجتبا سادات پور';
    }
  }
});
if (themeSwitch) themeSwitch.onchange = () => {
  chrome.storage.sync.set({ theme: themeSwitch.value });
  applyTheme(themeSwitch.value);
};
if (langSwitch) langSwitch.onchange = () => {
  chrome.storage.sync.set({ lang: langSwitch.value }, () => {
    location.reload();
  });
};

// --- Header Date Display ---
function renderHeaderDateDisplay() {
  const el = document.getElementById('header-date-display');
  if (!el) return;
  // مقدار تاریخ امروز را به صورت دستی برای تست قرار بده
  const jalaliStr = '1404/02/25';
  const today = todayGregorian();
  const miladiStr = `${today.gy}/${today.gm}/${today.gd}`;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
      <span style="font-size:1.2em;">📅</span>
      <span>${jalaliStr}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:1.2em;">🌐</span>
      <span>${miladiStr}</span>
    </div>
  `;
}
renderHeaderDateDisplay();

// --- Calendar Section ---
function renderCalendar() {
  const el = document.getElementById('calendar-date');
  el.innerHTML = '';
}
renderCalendar();

// --- Bookmarks Section (full CRUD) ---
function renderBookmarks() {
  const list = document.getElementById('bookmarks-list');
  list.innerHTML = '';
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['bookmarks'], (res) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        // فقط localStorage را بخوان
        let bookmarks = [];
        try { bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch (e) { bookmarks = []; }
        bookmarks.forEach((bm, i) => {
          const item = document.createElement('div');
          item.className = 'bookmark-item';
          item.title = bm.url;
          const favicon = document.createElement('img');
          favicon.className = 'bookmark-favicon';
          favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bm.url)}`;
          favicon.alt = '';
          const title = document.createElement('span');
          title.textContent = bm.title || bm.url;
          item.onclick = (e) => {
            if (e.target.classList.contains('delete-btn')) return;
            window.open(bm.url, '_blank');
          };
          const del = document.createElement('button');
          del.className = 'delete-btn';
          del.textContent = '🗑️';
          del.onclick = (e) => {
            e.stopPropagation();
            bookmarks.splice(i, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
          };
          item.appendChild(favicon);
          item.appendChild(title);
          item.appendChild(del);
          list.appendChild(item);
        });
        return;
      }
      // اگر chrome درست بود، localStorage را پاک کن
      localStorage.removeItem('bookmarks');
      const bookmarks = res.bookmarks || [];
      bookmarks.forEach((bm, i) => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        item.title = bm.url;
        const favicon = document.createElement('img');
        favicon.className = 'bookmark-favicon';
        favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bm.url)}`;
        favicon.alt = '';
        const title = document.createElement('span');
        title.textContent = bm.title || bm.url;
        item.onclick = (e) => {
          if (e.target.classList.contains('delete-btn')) return;
          window.open(bm.url, '_blank');
        };
        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.textContent = '🗑️';
        del.onclick = (e) => {
          e.stopPropagation();
          bookmarks.splice(i, 1);
          chrome.storage.sync.set({ bookmarks }, renderBookmarks);
        };
        item.appendChild(favicon);
        item.appendChild(title);
        item.appendChild(del);
        list.appendChild(item);
      });
    });
  } else {
    let bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch (e) { bookmarks = []; }
    bookmarks.forEach((bm, i) => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';
      item.title = bm.url;
      const favicon = document.createElement('img');
      favicon.className = 'bookmark-favicon';
      favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bm.url)}`;
      favicon.alt = '';
      const title = document.createElement('span');
      title.textContent = bm.title || bm.url;
      item.onclick = (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        window.open(bm.url, '_blank');
      };
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '🗑️';
      del.onclick = (e) => {
        e.stopPropagation();
        bookmarks.splice(i, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
      };
      item.appendChild(favicon);
      item.appendChild(title);
      item.appendChild(del);
      list.appendChild(item);
    });
  }
}

// Add bookmark form (inline, toggled by button)
let addFormVisible = false;
const addBtn = document.getElementById('add-bookmark-btn');
let addForm = null;
if (addBtn) addBtn.onclick = () => {
  if (addFormVisible) return;
  addFormVisible = true;
  addForm = document.createElement('form');
  addForm.style.display = 'flex';
  addForm.style.gap = '8px';
  addForm.style.marginTop = '8px';
  addForm.innerHTML = `
    <input type="text" placeholder="عنوان یا نام سایت" class="neumorph-input" style="flex:1;min-width:80px;" required />
    <input type="url" placeholder="https://example.com" class="neumorph-input" style="flex:2;min-width:120px;" required />
    <button type="submit" class="neumorph-btn">ثبت</button>
    <button type="button" class="neumorph-btn" id="cancel-bookmark">✖</button>
  `;
  addBtn.parentNode.insertBefore(addForm, addBtn.nextSibling);
  const [titleInput, urlInput, submitBtn, cancelBtn] = addForm.elements;
  if (addForm) addForm.onsubmit = (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    if (!/^https?:\/\//.test(url)) {
      urlInput.setCustomValidity('آدرس باید با http یا https شروع شود');
      urlInput.reportValidity();
      return;
    }
    chrome.storage.sync.get(['bookmarks'], (res) => {
      const bookmarks = res.bookmarks || [];
      bookmarks.push({ title, url });
      chrome.storage.sync.set({ bookmarks }, () => {
        renderBookmarks();
        addForm.remove();
        addFormVisible = false;
      });
    });
  };
  if (cancelBtn) cancelBtn.onclick = () => {
    addForm.remove();
    addFormVisible = false;
  };
};

// --- Checklist Section (مقاوم و بدون باگ) ---
function renderChecklist() {
  const list = document.getElementById('checklist');
  const errorDiv = document.getElementById('checklist-error');
  list.innerHTML = '';
  errorDiv.textContent = '';
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['checklist'], (res) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          errorDiv.textContent = 'خطا در خواندن داده‌ها از کروم: ' + chrome.runtime.lastError.message;
          renderChecklistLocal();
          return;
        }
        const items = res.checklist || [];
        renderChecklistItems(items, list, errorDiv, true);
      });
    } else {
      renderChecklistLocal();
    }
  } catch (err) {
    errorDiv.textContent = 'خطا: ' + err.message;
    renderChecklistLocal();
  }
}
function renderChecklistLocal() {
  const list = document.getElementById('checklist');
  const errorDiv = document.getElementById('checklist-error');
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem('checklist') || '[]');
  } catch (e) { items = []; }
  errorDiv.textContent = 'ذخیره‌سازی لوکال فعال است.';
  renderChecklistItems(items, list, errorDiv, false);
}
function renderChecklistItems(items, list, errorDiv, useChrome) {
  list.innerHTML = '';
  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.style.color = '#aaa';
    empty.textContent = 'هنوز آیتمی ثبت نشده است.';
    list.appendChild(empty);
    return;
  }
  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = item.done;
    cb.onchange = () => {
      items[i].done = cb.checked;
      saveChecklist(items, errorDiv, useChrome);
    };
    const span = document.createElement('span');
    span.textContent = item.text;
    span.style.margin = '0 8px';
    if (item.done) span.style.textDecoration = 'line-through';
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '🗑️';
    del.onclick = (e) => {
      e.preventDefault();
      items.splice(i, 1);
      saveChecklist(items, errorDiv, useChrome);
    };
    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}
function saveChecklist(items, errorDiv, useChrome) {
  try {
    if (useChrome && typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ checklist: items }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          errorDiv.textContent = 'خطا در ذخیره‌سازی کروم: ' + chrome.runtime.lastError.message;
        } else {
          renderChecklist();
        }
      });
    } else {
      localStorage.setItem('checklist', JSON.stringify(items));
      renderChecklist();
    }
  } catch (err) {
    errorDiv.textContent = 'خطا در ذخیره‌سازی: ' + err.message;
  }
}
document.getElementById('add-checklist-form').onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('checklist-input');
  const errorDiv = document.getElementById('checklist-error');
  errorDiv.textContent = '';
  const text = input.value.trim();
  if (!text) return;
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['checklist'], (res) => {
        let items = res.checklist || [];
        items.push({ text, done: false });
        saveChecklist(items, errorDiv, true);
        input.value = '';
      });
    } else {
      let items = [];
      try { items = JSON.parse(localStorage.getItem('checklist') || '[]'); } catch (e) { items = []; }
      items.push({ text, done: false });
      saveChecklist(items, errorDiv, false);
      input.value = '';
    }
  } catch (err) {
    errorDiv.textContent = 'خطا: ' + err.message;
  }
};
// المنت پیام خطا را به HTML اضافه کن اگر وجود ندارد
if (!document.getElementById('checklist-error')) {
  const errDiv = document.createElement('div');
  errDiv.id = 'checklist-error';
  errDiv.style.color = '#e11d48';
  errDiv.style.fontSize = '0.95em';
  document.querySelector('.checklist-section').appendChild(errDiv);
}
renderChecklist();

// --- Notes Section (کامل) ---
const notesEl = document.getElementById('quick-notes');
if (notesEl) {
  notesEl.oninput = () => {
    chrome.storage.sync.set({ moji_notes: notesEl.value });
  };
  loadNotes();
}

// --- Projects Section (جدید و مقاوم) ---
function saveProjects(projects, callback) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ projects }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          localStorage.setItem('projects', JSON.stringify(projects));
        }
        if (callback) callback();
      });
    } else {
      localStorage.setItem('projects', JSON.stringify(projects));
      if (callback) callback();
    }
  } catch (err) {
    localStorage.setItem('projects', JSON.stringify(projects));
    if (callback) callback();
  }
}
function renderProjects() {
  const list = document.getElementById('project-list');
  list.innerHTML = '';
  function renderList(projects) {
    if (projects.length === 0) {
      const empty = document.createElement('li');
      empty.style.color = '#aaa';
      empty.textContent = 'هنوز پروژه‌ای ثبت نشده است.';
      list.appendChild(empty);
      return;
    }
    projects.forEach((prj, i) => {
      const li = document.createElement('li');
      li.textContent = prj.title;
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '🗑️';
      del.onclick = () => {
        projects.splice(i, 1);
        saveProjects(projects, renderProjects);
      };
      li.appendChild(del);
      list.appendChild(li);
    });
  }
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['projects'], (res) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        let projects = [];
        try { projects = JSON.parse(localStorage.getItem('projects') || '[]'); } catch (e) { projects = []; }
        renderList(projects);
        return;
      }
      // اگر chrome درست بود، localStorage را پاک کن
      localStorage.removeItem('projects');
      const projects = res.projects || [];
      renderList(projects);
    });
  } else {
    let projects = [];
    try { projects = JSON.parse(localStorage.getItem('projects') || '[]'); } catch (e) { projects = []; }
    renderList(projects);
  }
}
document.getElementById('add-project-form').onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('project-input');
  const title = input.value.trim();
  if (!title) return;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['projects'], (res) => {
      let projects = res.projects || [];
      projects.push({ title });
      saveProjects(projects, () => {
        renderProjects();
        input.value = '';
      });
    });
  } else {
    let projects = [];
    try { projects = JSON.parse(localStorage.getItem('projects') || '[]'); } catch (e) { projects = []; }
    projects.push({ title });
    saveProjects(projects, () => {
      renderProjects();
      input.value = '';
    });
  }
};

// --- Targets Section (جدید و مقاوم) ---
function saveTargets(targets, callback) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ targets }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          localStorage.setItem('targets', JSON.stringify(targets));
        }
        if (callback) callback();
      });
    } else {
      localStorage.setItem('targets', JSON.stringify(targets));
      if (callback) callback();
    }
  } catch (err) {
    localStorage.setItem('targets', JSON.stringify(targets));
    if (callback) callback();
  }
}
function renderTargets() {
  const list = document.getElementById('target-list');
  list.innerHTML = '';
  function renderList(targets) {
    if (targets.length === 0) {
      const empty = document.createElement('li');
      empty.style.color = '#aaa';
      empty.textContent = 'هنوز هدفی ثبت نشده است.';
      list.appendChild(empty);
      return;
    }
    targets.forEach((t, i) => {
      const li = document.createElement('li');
      li.textContent = t.title;
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = '🗑️';
      del.onclick = () => {
        targets.splice(i, 1);
        saveTargets(targets, renderTargets);
      };
      li.appendChild(del);
      list.appendChild(li);
    });
  }
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['targets'], (res) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        let targets = [];
        try { targets = JSON.parse(localStorage.getItem('targets') || '[]'); } catch (e) { targets = []; }
        renderList(targets);
        return;
      }
      // اگر chrome درست بود، localStorage را پاک کن
      localStorage.removeItem('targets');
      const targets = res.targets || [];
      renderList(targets);
    });
  } else {
    let targets = [];
    try { targets = JSON.parse(localStorage.getItem('targets') || '[]'); } catch (e) { targets = []; }
    renderList(targets);
  }
}
document.getElementById('add-target-form').onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById('target-input');
  const title = input.value.trim();
  if (!title) return;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['targets'], (res) => {
      let targets = res.targets || [];
      targets.push({ title });
      saveTargets(targets, () => {
        renderTargets();
        input.value = '';
      });
    });
  } else {
    let targets = [];
    try { targets = JSON.parse(localStorage.getItem('targets') || '[]'); } catch (e) { targets = []; }
    targets.push({ title });
    saveTargets(targets, () => {
      renderTargets();
      input.value = '';
    });
  }
};

// --- امتیاز روزانه: نمایش شعر شاهنامه ---
function renderDailyScoreVerse() {
  const container = document.querySelector('.score-section');
  if (!container) return;
  const url = chrome.runtime.getURL('js/shahnameh_verses.json');
  chrome.storage.sync.get(['lang'], (res) => {
    const lang = res.lang || 'fa';
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('HTTP status ' + res.status);
        return res.json();
      })
      .then(verses => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const idx = Math.floor(Math.random() * verses.length);
        const verse = verses[idx];
        container.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:8px;">
            <img src="../icons/ferdowsi.png" alt="فردوسی" style="width:80px;height:100px;vertical-align:middle;margin-bottom:4px;" />
            <span style="font-weight:bold;font-size:1.1em;">${lang === 'fa' ? 'بیتی از شاهنامه' : 'Shahnameh Verse'}</span>
          </div>
          <div class="daily-verse">${verse.verse.replace(/\n/g, '<br>')}</div>
          <div class="daily-meaning">${lang === 'fa' ? verse.meaning : (verse.meaning_en || verse.meaning)}</div>
        `;
      })
      .catch((err) => {
        console.error('[MojiPlanner] Error loading verse:', err);
        container.innerHTML = '<div style="color:#e11d48">خطا در بارگذاری شعر</div>';
      });
  });
}

// --- Pomodoro Section ---
renderPomodoro(document.getElementById('pomodoro-timer'));

// --- Contact Manager Section ---
function renderContacts() {
  const list = document.getElementById('contacts-list');
  list.innerHTML = '';
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['contacts'], (res) => {
      if (chrome.runtime && chrome.runtime.lastError) {
        let contacts = [];
        try { contacts = JSON.parse(localStorage.getItem('contacts') || '[]'); } catch (e) { contacts = []; }
        renderContactsList(contacts, list, false);
        return;
      }
      localStorage.removeItem('contacts');
      const contacts = res.contacts || [];
      renderContactsList(contacts, list, true);
    });
  } else {
    let contacts = [];
    try { contacts = JSON.parse(localStorage.getItem('contacts') || '[]'); } catch (e) { contacts = []; }
    renderContactsList(contacts, list, false);
  }
}
function renderContactsList(contacts, list, useChrome) {
  if (contacts.length === 0) {
    const empty = document.createElement('div');
    empty.style.color = '#aaa';
    empty.textContent = 'هنوز مخاطبی ثبت نشده است.';
    list.appendChild(empty);
    return;
  }
  contacts.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.alignItems = 'center';
    div.style.marginBottom = '4px';
    div.innerHTML = `
      <span style="min-width:70px;font-weight:bold;">${c.name}</span>
      <span style="min-width:90px;">${c.phone}</span>
      <span style="min-width:70px;">${c.unit}</span>
    `;
    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '🗑️';
    del.onclick = () => {
      contacts.splice(i, 1);
      saveContacts(contacts, useChrome, renderContacts);
    };
    div.appendChild(del);
    list.appendChild(div);
  });
}
function saveContacts(contacts, useChrome, callback) {
  if (useChrome && typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ contacts }, callback);
  } else {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    if (callback) callback();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Date Display ---
  renderHeaderDateDisplay();

  // --- Calendar Section ---
  renderCalendar();

  // --- Bookmarks Section (full CRUD) ---
  renderBookmarks();
  addBtn.onclick = () => {
    if (addFormVisible) return;
    addFormVisible = true;
    addForm = document.createElement('form');
    addForm.style.display = 'flex';
    addForm.style.gap = '8px';
    addForm.style.marginTop = '8px';
    addForm.innerHTML = `
      <input type="text" placeholder="عنوان یا نام سایت" class="neumorph-input" style="flex:1;min-width:80px;" required />
      <input type="url" placeholder="https://example.com" class="neumorph-input" style="flex:2;min-width:120px;" required />
      <button type="submit" class="neumorph-btn">ثبت</button>
      <button type="button" class="neumorph-btn" id="cancel-bookmark">✖</button>
    `;
    addBtn.parentNode.insertBefore(addForm, addBtn.nextSibling);
    const [titleInput, urlInput, submitBtn, cancelBtn] = addForm.elements;
    addForm.onsubmit = (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const url = urlInput.value.trim();
      if (!/^https?:\/\//.test(url)) {
        urlInput.setCustomValidity('آدرس باید با http یا https شروع شود');
        urlInput.reportValidity();
        return;
      }
      chrome.storage.sync.get(['bookmarks'], (res) => {
        const bookmarks = res.bookmarks || [];
        bookmarks.push({ title, url });
        chrome.storage.sync.set({ bookmarks }, () => {
          renderBookmarks();
          addForm.remove();
          addFormVisible = false;
        });
      });
    };
    cancelBtn.onclick = () => {
      addForm.remove();
      addFormVisible = false;
    };
  };

  // --- Checklist Section ---
  if (!document.getElementById('checklist-error')) {
    const errDiv = document.createElement('div');
    errDiv.id = 'checklist-error';
    errDiv.style.color = '#e11d48';
    errDiv.style.fontSize = '0.95em';
    document.querySelector('.checklist-section').appendChild(errDiv);
  }
  renderChecklist();
  document.getElementById('add-checklist-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('checklist-input');
    const errorDiv = document.getElementById('checklist-error');
    errorDiv.textContent = '';
    const text = input.value.trim();
    if (!text) return;
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['checklist'], (res) => {
          let items = res.checklist || [];
          items.push({ text, done: false });
          saveChecklist(items, errorDiv, true);
          input.value = '';
        });
      } else {
        let items = [];
        try { items = JSON.parse(localStorage.getItem('checklist') || '[]'); } catch (e) { items = []; }
        items.push({ text, done: false });
        saveChecklist(items, errorDiv, false);
        input.value = '';
      }
    } catch (err) {
      errorDiv.textContent = 'خطا: ' + err.message;
    }
  };

  // --- Notes Section ---
  if (notesEl) {
    notesEl.oninput = () => {
      chrome.storage.sync.set({ moji_notes: notesEl.value });
    };
    loadNotes();
  }

  // --- Projects Section ---
  renderProjects();
  document.getElementById('add-project-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('project-input');
    const title = input.value.trim();
    if (!title) return;
    chrome.storage.sync.get(['projects'], (res) => {
      const projects = res.projects || [];
      projects.push({ title });
      chrome.storage.sync.set({ projects }, () => {
        renderProjects();
        input.value = '';
      });
    });
  };

  // --- Targets Section ---
  renderTargets();
  document.getElementById('add-target-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('target-input');
    const title = input.value.trim();
    if (!title) return;
    chrome.storage.sync.get(['targets'], (res) => {
      const targets = res.targets || [];
      targets.push({ title });
      chrome.storage.sync.set({ targets }, () => {
        renderTargets();
        input.value = '';
      });
    });
  };

  // --- امتیاز روزانه: نمایش شعر شاهنامه ---
  renderDailyScoreVerse();

  // --- Pomodoro Section ---
  renderPomodoro(document.getElementById('pomodoro-timer'));

  // --- Contact Manager Section ---
  renderContacts();
  const contactForm = document.getElementById('add-contact-form');
  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const unit = document.getElementById('contact-unit').value.trim();
      if (!name || !phone || !unit) return;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['contacts'], (res) => {
          const contacts = res.contacts || [];
          contacts.push({ name, phone, unit });
          chrome.storage.sync.set({ contacts }, () => {
            renderContacts();
            contactForm.reset();
          });
        });
      } else {
        let contacts = [];
        try { contacts = JSON.parse(localStorage.getItem('contacts') || '[]'); } catch (e) { contacts = []; }
        contacts.push({ name, phone, unit });
        localStorage.setItem('contacts', JSON.stringify(contacts));
        renderContacts();
        contactForm.reset();
      }
    };
  }
}); 
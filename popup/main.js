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
    // تغییر عنوان چک‌لیست پروژه‌ای
    const checklistTitle = document.querySelector('.checklist-section .section-title');
    if (checklistTitle) checklistTitle.innerText = 'Project Checklist';
    // تغییر placeholder ورودی افزودن لیست
    const projectNameInput = document.getElementById('project-name-input');
    if (projectNameInput) projectNameInput.placeholder = 'New list ...';
    // تغییر متن دکمه افزودن لیست
    const addProjectBtn = document.querySelector('#add-project-form-checklist button[type="submit"]');
    if (addProjectBtn) addProjectBtn.textContent = '+ New Task';
    // تغییر placeholder و دکمه افزودن بخش جدید در چک‌لیست پروژه‌ای (زیرگروه)
    const sectionInputs = document.querySelectorAll('.add-section-form input');
    sectionInputs.forEach(input => { input.placeholder = 'New section (e.g. Daily Tasks)...'; });
    const sectionBtns = document.querySelectorAll('.add-section-form button[type="submit"]');
    sectionBtns.forEach(btn => { btn.textContent = '+'; });
    // تغییر placeholder ورودی تسک جدید و دکمه افزودن تسک در زیرگروه‌ها (انگلیسی)
    const addTaskInputs = document.querySelectorAll('.add-task-form input');
    addTaskInputs.forEach(input => { input.placeholder = 'New task ...'; });
    const addTaskBtns = document.querySelectorAll('.add-task-form button[type="submit"]');
    addTaskBtns.forEach(btn => { btn.textContent = '+'; });
    // --- Backup Dropdown Localization ---
    const backupDropdownBtn = document.getElementById('backup-dropdown-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    if (backupDropdownBtn) backupDropdownBtn.querySelector('span').textContent = 'Backup';
    if (exportBtn) exportBtn.textContent = 'Export';
    if (importBtn) importBtn.textContent = 'Import';
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
    // --- Backup Dropdown Localization ---
    const backupDropdownBtn = document.getElementById('backup-dropdown-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    if (backupDropdownBtn) backupDropdownBtn.querySelector('span').textContent = 'پشتیبان‌گیری';
    if (exportBtn) exportBtn.textContent = 'خروجی گرفتن';
    if (importBtn) importBtn.textContent = 'ورود اطلاعات';
  }
  // --- Backup Switch Localization in applyLang ---
  const backupSwitch = document.getElementById('backup-switch');
  if (backupSwitch) {
    backupSwitch.options[0].text = lang === 'fa' ? 'پشتیبان‌گیری' : 'Backup';
    backupSwitch.options[1].text = lang === 'fa' ? 'خروجی گرفتن' : 'Export';
    backupSwitch.options[2].text = lang === 'fa' ? 'ورود اطلاعات' : 'Import';
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
  const d = new Date();
  // تاریخ شمسی با اعداد لاتین
  const jalaliStr = d.toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });
  // استخراج شماره ماه شمسی
  const jalaliParts = jalaliStr.split('/');
  const jalaliMonth = parseInt(jalaliParts[1], 10);
  // نام ماه فارسی
  const jalaliMonthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  const jalaliMonthName = jalaliMonthNames[jalaliMonth - 1] || '';
  // تاریخ میلادی
  const miladiStr = d.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  // استخراج شماره ماه میلادی
  const miladiParts = miladiStr.split('-');
  const miladiMonth = parseInt(miladiParts[1], 10);
  // نام ماه میلادی
  const miladiMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const miladiMonthName = miladiMonthNames[miladiMonth - 1] || '';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-direction:column;align-items:flex-start;">
      <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:1.2em;">📅</span>
      <span>${jalaliStr}</span>
    </div>
      <span style="font-size:12px;color:#888;margin-top:0;margin-right:28px;">${jalaliMonthName}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;flex-direction:column;align-items:flex-start;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:1.2em;">🌐</span>
      <span>${miladiStr}</span>
      </div>
      <span style="font-size:12px;color:#888;margin-top:0;margin-right:28px;">${miladiMonthName}</span>
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

// --- Drag & Drop Helper ---
function addDragAndDrop(listEl, items, saveFn, renderFn) {
  let dragSrcIdx = null;
  Array.from(listEl.children).forEach((li, idx) => {
    li.draggable = true;
    li.ondragstart = (e) => {
      dragSrcIdx = idx;
      e.dataTransfer.effectAllowed = 'move';
      li.classList.add('dragging');
    };
    li.ondragend = () => {
      li.classList.remove('dragging');
    };
    li.ondragover = (e) => {
      e.preventDefault();
      li.classList.add('drag-over');
    };
    li.ondragleave = () => {
      li.classList.remove('drag-over');
    };
    li.ondrop = (e) => {
      e.preventDefault();
      li.classList.remove('drag-over');
      if (dragSrcIdx !== null && dragSrcIdx !== idx) {
        const moved = items.splice(dragSrcIdx, 1)[0];
        items.splice(idx, 0, moved);
        saveFn(items, renderFn);
      }
      dragSrcIdx = null;
    };
  });
}

// --- Bookmarks Section (full CRUD) ---
function renderBookmarks() {
  const list = document.getElementById('bookmarks-list');
  // حذف پیام خالی قبلی
  const prevEmpty = document.getElementById('empty-bookmark-msg');
  if (prevEmpty) prevEmpty.remove();

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['bookmarks'], (res) => {
      const bookmarks = res.bookmarks || [];
      list.innerHTML = '';
      if (bookmarks.length === 0) {
        const empty = document.createElement('div');
        empty.id = 'empty-bookmark-msg';
        empty.style.color = '#aaa';
        empty.textContent = 'هنوز بوکمارکی ثبت نشده است.';
        list.parentNode.insertBefore(empty, list);
        return;
      }
      bookmarks.forEach((bm, i) => {
        const li = document.createElement('li');
        li.className = 'bookmark-item';
        li.title = bm.url;
        const favicon = document.createElement('img');
        favicon.className = 'bookmark-favicon';
        favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bm.url)}`;
        favicon.alt = '';
        const title = document.createElement('span');
        title.textContent = bm.title || bm.url;
        li.onclick = (e) => {
          if (e.target.classList.contains('delete-btn')) return;
          window.open(bm.url, '_blank');
        };
        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.innerHTML = '';
        del.appendChild(createDeleteIcon());
        del.onclick = (e) => {
          e.stopPropagation();
          bookmarks.splice(i, 1);
          chrome.storage.sync.set({ bookmarks }, renderBookmarks);
        };
        li.appendChild(favicon);
        li.appendChild(title);
        li.appendChild(del);
        list.appendChild(li);
      });
      // Destroy Sortable قبلی
      if (list._sortableInstance) list._sortableInstance.destroy();
      if (bookmarks.length > 1) {
        list._sortableInstance = Sortable.create(list, {
          animation: 150,
          onEnd: function (evt) {
            const [removed] = bookmarks.splice(evt.oldIndex, 1);
            bookmarks.splice(evt.newIndex, 0, removed);
            chrome.storage.sync.set({ bookmarks }, renderBookmarks);
          }
        });
      }
    });
  } else {
    let bookmarks = [];
    try { bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch (e) { bookmarks = []; }
    list.innerHTML = '';
    if (bookmarks.length === 0) {
      const empty = document.createElement('div');
      empty.id = 'empty-bookmark-msg';
      empty.style.color = '#aaa';
      empty.textContent = 'هنوز بوکمارکی ثبت نشده است.';
      list.parentNode.insertBefore(empty, list);
      return;
    }
    bookmarks.forEach((bm, i) => {
      const li = document.createElement('li');
      li.className = 'bookmark-item';
      li.title = bm.url;
      const favicon = document.createElement('img');
      favicon.className = 'bookmark-favicon';
      favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bm.url)}`;
      favicon.alt = '';
      const title = document.createElement('span');
      title.textContent = bm.title || bm.url;
      li.onclick = (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        window.open(bm.url, '_blank');
      };
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '';
      del.appendChild(createDeleteIcon());
      del.onclick = (e) => {
        e.stopPropagation();
        bookmarks.splice(i, 1);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        renderBookmarks();
      };
      li.appendChild(favicon);
      li.appendChild(title);
      li.appendChild(del);
      list.appendChild(li);
    });
    // Destroy Sortable قبلی
    if (list._sortableInstance) list._sortableInstance.destroy();
    if (bookmarks.length > 1) {
      list._sortableInstance = Sortable.create(list, {
        animation: 150,
        onEnd: function (evt) {
          const [removed] = bookmarks.splice(evt.oldIndex, 1);
          bookmarks.splice(evt.newIndex, 0, removed);
          localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
          renderBookmarks();
        }
      });
    }
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

// --- Project Checklist Section (گروه‌بندی پروژه‌ای با بخش) ---
function getDefaultChecklist() {
  return [];
}

function saveProjectChecklist(data, callback) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.set({ projectChecklist: data }, callback);
  } else {
    localStorage.setItem('projectChecklist', JSON.stringify(data));
    if (callback) callback();
  }
}
function loadProjectChecklist(callback) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['projectChecklist'], (res) => {
      callback(res.projectChecklist || getDefaultChecklist());
      });
    } else {
    let data = [];
    try { data = JSON.parse(localStorage.getItem('projectChecklist') || '[]'); } catch (e) { data = []; }
    callback(data);
}
}

function renderProjectChecklist() {
  const list = document.getElementById('project-checklist');
  list.innerHTML = '';
  loadProjectChecklist((projects) => {
    if (!projects.length) {
      const empty = document.createElement('li');
      empty.style.color = '#aaa';
      empty.textContent = 'هنوز پروژه‌ای ثبت نشده است.';
      list.appendChild(empty);
      return;
    }
    projects.forEach((project, pi) => {
      const projectLi = document.createElement('li');
      projectLi.className = 'project-accordion';
      // Project header
      const projectHeader = document.createElement('div');
      projectHeader.className = 'project-header';
      // آیکون‌ها در یک div جداگانه (پروژه)
      const iconDiv = document.createElement('div');
      iconDiv.style.display = 'flex';
      iconDiv.style.alignItems = 'center';
      // آیکون دراپ‌داون مینیمال (▷/▽)
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = project._open ? '▽' : '▷';
      toggleBtn.className = 'toggle-btn';
      toggleBtn.style.marginLeft = '6px';
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        project._open = !project._open;
        saveProjectChecklist(projects, renderProjectChecklist);
      };
      // آیکون حذف
      const delProjectBtn = document.createElement('button');
      delProjectBtn.className = 'delete-btn';
      delProjectBtn.innerHTML = '';
      delProjectBtn.appendChild(createDeleteIcon());
      delProjectBtn.onclick = () => {
        projects.splice(pi, 1);
        saveProjectChecklist(projects, renderProjectChecklist);
      };
      // اضافه کردن آیکون‌ها به div (اول حذف، بعد دراپ‌داون سمت چپ)
      iconDiv.appendChild(delProjectBtn);
      iconDiv.appendChild(toggleBtn);
      // ساختار هدر: [عنوان پروژه][آیکون‌ها]
      const projectTitleSpan = document.createElement('span');
      projectTitleSpan.textContent = project.projectName;
      projectHeader.appendChild(projectTitleSpan);
      projectHeader.appendChild(iconDiv);
      // کلیک روی کل هدر (به جز حذف) پروژه را باز/بسته کند
      projectHeader.onclick = (e) => {
        if (e.target === delProjectBtn) return;
        e.stopPropagation();
        project._open = !project._open;
        saveProjectChecklist(projects, renderProjectChecklist);
      };
      projectLi.appendChild(projectHeader);
      // Project body (sections)
      if (project._open) {
        const sectionList = document.createElement('ul');
        sectionList.className = 'section-list';
        if (!project.sections || !project.sections.length) {
          const emptySection = document.createElement('li');
          emptySection.style.color = '#bbb';
          emptySection.textContent = 'هنوز بخشی ثبت نشده است.';
          sectionList.appendChild(emptySection);
        } else {
          project.sections.forEach((section, si) => {
            const sectionLi = document.createElement('li');
            sectionLi.className = 'section-accordion';
            // Section header
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'section-header';
            // آیکون‌ها در یک div جداگانه (بخش)
            const sectionIconDiv = document.createElement('div');
            sectionIconDiv.style.display = 'flex';
            sectionIconDiv.style.alignItems = 'center';
            // Toggle section
            const toggleSectionBtn = document.createElement('button');
            toggleSectionBtn.textContent = section._open ? '▽' : '▷';
            toggleSectionBtn.className = 'toggle-btn';
            toggleSectionBtn.style.marginLeft = '6px';
            toggleSectionBtn.onclick = (e) => {
              e.stopPropagation();
              section._open = !section._open;
              saveProjectChecklist(projects, renderProjectChecklist);
            };
            // Delete section
            const delSectionBtn = document.createElement('button');
            delSectionBtn.className = 'delete-btn';
            delSectionBtn.innerHTML = '';
            delSectionBtn.appendChild(createDeleteIcon());
            delSectionBtn.onclick = () => {
              project.sections.splice(si, 1);
              saveProjectChecklist(projects, renderProjectChecklist);
            };
            // اضافه کردن آیکون‌ها به div (اول حذف، بعد دراپ‌داون سمت چپ)
            sectionIconDiv.appendChild(delSectionBtn);
            sectionIconDiv.appendChild(toggleSectionBtn);
            // ساختار هدر: [عنوان بخش][آیکون‌ها]
            const sectionTitleSpan = document.createElement('span');
            sectionTitleSpan.textContent = section.sectionName;
            sectionHeader.appendChild(sectionTitleSpan);
            sectionHeader.appendChild(sectionIconDiv);
            // کلیک روی کل هدر (به جز حذف) بخش را باز/بسته کند
            sectionHeader.onclick = (e) => {
              if (e.target === delSectionBtn) return;
              e.stopPropagation();
              section._open = !section._open;
              saveProjectChecklist(projects, renderProjectChecklist);
            };
            sectionLi.appendChild(sectionHeader);
            // Section body (tasks)
            if (section._open) {
              const taskList = document.createElement('ul');
              taskList.className = 'task-list';
              if (!section.tasks || !section.tasks.length) {
                const emptyTask = document.createElement('li');
                emptyTask.style.color = '#ccc';
                emptyTask.textContent = 'هنوز کاری ثبت نشده است.';
                taskList.appendChild(emptyTask);
              } else {
                section.tasks.forEach((task, ti) => {
                  const taskLi = document.createElement('li');
                  taskLi.className = 'task-item';
                  const cb = document.createElement('input');
                  cb.type = 'checkbox';
                  cb.checked = task.done;
                  cb.onchange = () => {
                    section.tasks[ti].done = cb.checked;
                    saveProjectChecklist(projects, renderProjectChecklist);
                  };
                  const span = document.createElement('span');
                  span.textContent = task.text;
                  if (task.done) span.style.textDecoration = 'line-through';
                  // Delete task
                  const delTaskBtn = document.createElement('button');
                  delTaskBtn.className = 'delete-btn';
                  delTaskBtn.innerHTML = '';
                  delTaskBtn.appendChild(createDeleteIcon());
                  delTaskBtn.onclick = () => {
                    section.tasks.splice(ti, 1);
                    saveProjectChecklist(projects, renderProjectChecklist);
                  };
                  taskLi.appendChild(cb);
                  taskLi.appendChild(span);
                  taskLi.appendChild(delTaskBtn);
                  taskList.appendChild(taskLi);
                });
              }
              // Add task form
              const addTaskForm = document.createElement('form');
              addTaskForm.className = 'add-task-form';
              addTaskForm.onsubmit = (e) => {
                e.preventDefault();
                const input = addTaskForm.querySelector('input');
                const text = input.value.trim();
                if (!text) return;
                section.tasks.push({ text, done: false });
                input.value = '';
                saveProjectChecklist(projects, renderProjectChecklist);
              };
              const taskInput = document.createElement('input');
              taskInput.type = 'text';
              taskInput.placeholder = 'کار جدید...';
              taskInput.className = 'neumorph-input';
              addTaskForm.appendChild(taskInput);
              const addBtn = document.createElement('button');
              addBtn.type = 'submit';
              addBtn.className = 'neumorph-btn';
              addBtn.textContent = '+';
              addTaskForm.appendChild(addBtn);
              taskList.appendChild(addTaskForm);
              sectionLi.appendChild(taskList);
              // --- SortableJS برای تسک‌ها ---
              setTimeout(() => {
                if (section.tasks && section.tasks.length > 1) {
                  Sortable.create(taskList, {
                    animation: 150,
                    onEnd: function (evt) {
                      const [removed] = section.tasks.splice(evt.oldIndex, 1);
                      section.tasks.splice(evt.newIndex, 0, removed);
                      saveProjectChecklist(projects, renderProjectChecklist);
                    }
                  });
                }
              }, 0);
            }
            // Drag & Drop بخش‌ها
            let dragSectionIdx = null;
            Array.from(sectionList.children).forEach((li, idx) => {
              if (li.className !== 'section-accordion') return;
              li.draggable = true;
              li.ondragstart = (e) => {
                dragSectionIdx = idx;
                e.dataTransfer.effectAllowed = 'move';
                li.classList.add('dragging');
              };
              li.ondragend = () => {
                li.classList.remove('dragging');
              };
              li.ondragover = (e) => {
                e.preventDefault();
                li.classList.add('drag-over');
              };
              li.ondragleave = () => {
                li.classList.remove('drag-over');
              };
              li.ondrop = (e) => {
                e.preventDefault();
                li.classList.remove('drag-over');
                if (dragSectionIdx !== null && dragSectionIdx !== idx) {
                  const moved = project.sections.splice(dragSectionIdx, 1)[0];
                  project.sections.splice(idx, 0, moved);
                  saveProjectChecklist(projects, renderProjectChecklist);
                }
                dragSectionIdx = null;
              };
            });
            sectionList.appendChild(sectionLi);
          });
          // --- SortableJS برای بخش‌ها ---
          setTimeout(() => {
            if (project.sections && project.sections.length > 1) {
              Sortable.create(sectionList, {
                animation: 150,
                onEnd: function (evt) {
                  const [removed] = project.sections.splice(evt.oldIndex, 1);
                  project.sections.splice(evt.newIndex, 0, removed);
                  saveProjectChecklist(projects, renderProjectChecklist);
                }
              });
            }
          }, 0);
        }
        // Add section form
        const addSectionForm = document.createElement('form');
        addSectionForm.className = 'add-section-form';
        addSectionForm.onsubmit = (e) => {
          e.preventDefault();
          const input = addSectionForm.querySelector('input');
          const text = input.value.trim();
          if (!text) return;
          if (!project.sections) project.sections = [];
          project.sections.push({ sectionName: text, tasks: [], _open: true });
          input.value = '';
          saveProjectChecklist(projects, renderProjectChecklist);
        };
        const sectionInput = document.createElement('input');
        sectionInput.type = 'text';
        sectionInput.placeholder = 'بخش جدید (مثلاً کارهای روزانه)...';
        sectionInput.className = 'neumorph-input';
        addSectionForm.appendChild(sectionInput);
        const addSectionBtn = document.createElement('button');
        addSectionBtn.type = 'submit';
        addSectionBtn.className = 'neumorph-btn';
        addSectionBtn.textContent = '+';
        addSectionForm.appendChild(addSectionBtn);
        sectionList.appendChild(addSectionForm);
        projectLi.appendChild(sectionList);
      }
      // Drag & Drop پروژه‌ها
      projectLi.draggable = true;
      projectLi.ondragstart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        projectLi.classList.add('dragging');
        projectLi.dataset.dragIndex = pi;
      };
      projectLi.ondragend = () => {
        projectLi.classList.remove('dragging');
      };
      projectLi.ondragover = (e) => {
        e.preventDefault();
        projectLi.classList.add('drag-over');
      };
      projectLi.ondragleave = () => {
        projectLi.classList.remove('drag-over');
      };
      projectLi.ondrop = (e) => {
        e.preventDefault();
        projectLi.classList.remove('drag-over');
        const from = parseInt(document.querySelector('li.dragging')?.dataset.dragIndex);
        if (!isNaN(from) && from !== pi) {
          const moved = projects.splice(from, 1)[0];
          projects.splice(pi, 0, moved);
          saveProjectChecklist(projects, renderProjectChecklist);
        }
      };
      list.appendChild(projectLi);
    });
    // --- SortableJS برای پروژه‌ها ---
    setTimeout(() => {
      if (projects.length > 1) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function (evt) {
            const [removed] = projects.splice(evt.oldIndex, 1);
            projects.splice(evt.newIndex, 0, removed);
            saveProjectChecklist(projects, renderProjectChecklist);
          }
        });
      }
    }, 0);
  });
}
// فرم افزودن پروژه
const addProjectForm = document.getElementById('add-project-form-checklist');
if (addProjectForm) {
  addProjectForm.onsubmit = (e) => {
  e.preventDefault();
    const input = document.getElementById('project-name-input');
  const text = input.value.trim();
  if (!text) return;
    loadProjectChecklist((projects) => {
      projects.push({ projectName: text, sections: [], _open: true });
      saveProjectChecklist(projects, renderProjectChecklist);
        input.value = '';
      });
  };
}

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
      del.innerHTML = '';
      del.appendChild(createDeleteIcon());
      del.onclick = () => {
        projects.splice(i, 1);
        saveProjects(projects, renderProjects);
      };
      li.appendChild(del);
      list.appendChild(li);
    });
    // --- SortableJS برای پروژه‌ها ---
    setTimeout(() => {
      if (projects.length > 1) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function (evt) {
            const [removed] = projects.splice(evt.oldIndex, 1);
            projects.splice(evt.newIndex, 0, removed);
            saveProjects(projects, renderProjects);
          }
        });
      }
    }, 0);
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
      del.innerHTML = '';
      del.appendChild(createDeleteIcon());
      del.onclick = () => {
        targets.splice(i, 1);
        saveTargets(targets, renderTargets);
      };
      li.appendChild(del);
      list.appendChild(li);
    });
    // --- SortableJS برای اهداف ---
    setTimeout(() => {
      if (targets.length > 1) {
        Sortable.create(list, {
          animation: 150,
          onEnd: function (evt) {
            const [removed] = targets.splice(evt.oldIndex, 1);
            targets.splice(evt.newIndex, 0, removed);
            saveTargets(targets, renderTargets);
          }
        });
      }
    }, 0);
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
      chrome.storage.sync.set({ targets }, () => {
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
    del.innerHTML = '';
    del.appendChild(createDeleteIcon());
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

// --- Backup Switch Logic ---
const backupSwitch = document.getElementById('backup-switch');
const importFile = document.getElementById('import-file');
if (backupSwitch) {
  backupSwitch.onchange = (e) => {
    const value = backupSwitch.value;
    if (value === 'export') {
      const keys = [
        'projectChecklist', 'bookmarks', 'projects', 'targets', 'contacts', 'moji_notes'
      ];
      chrome.storage.sync.get(['lang', ...keys], (data) => {
        const lang = data.lang || 'fa';
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MKPlanner-backup-' + new Date().toISOString().slice(0,10) + '.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      });
      backupSwitch.value = 'none';
    } else if (value === 'import') {
      if (importFile) importFile.click();
      backupSwitch.value = 'none';
    }
  };
}
if (importFile) {
  importFile.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const allowedKeys = [
          'projectChecklist', 'bookmarks', 'projects', 'targets', 'contacts', 'moji_notes'
        ];
        const toImport = {};
        allowedKeys.forEach(key => {
          if (data[key] !== undefined) toImport[key] = data[key];
        });
        const lang = data.lang || 'fa';
        if (Object.keys(toImport).length === 0) {
          alert(lang === 'fa' ? 'فایل پشتیبان نامعتبر است!' : 'Invalid backup file!');
          return;
        }
        if (confirm(lang === 'fa' ? 'آیا مطمئن هستید که می‌خواهید این فایل پشتیبان را وارد کنید؟ این کار داده‌های فعلی شما را جایگزین می‌کند.' : 'Are you sure you want to import this backup? This will overwrite your current data.')) {
          chrome.storage.sync.set(toImport, () => {
            alert(lang === 'fa' ? 'پشتیبان با موفقیت وارد شد!' : 'Backup imported successfully!');
            location.reload();
          });
        }
      } catch (err) {
        alert('Invalid backup file!');
      }
    };
    reader.readAsText(file);
  };
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

  // --- Project Checklist Section ---
  if (!document.getElementById('checklist-error')) {
    const errDiv = document.createElement('div');
    errDiv.id = 'checklist-error';
    errDiv.style.color = '#e11d48';
    errDiv.style.fontSize = '0.95em';
    document.querySelector('.checklist-section').appendChild(errDiv);
  }
  renderProjectChecklist();

  // مقداردهی اولیه placeholderها بر اساس زبان انتخابی
  chrome.storage.sync.get(['lang'], (res) => {
    const lang = res.lang || 'fa';
    // ورودی تسک جدید
    document.querySelectorAll('.add-task-form input').forEach(input => {
      input.placeholder = lang === 'en' ? 'New task ...' : 'کار جدید...';
    });
    // ورودی بخش جدید
    document.querySelectorAll('.add-section-form input').forEach(input => {
      input.placeholder = lang === 'en' ? 'New section (e.g. Daily Tasks)...' : 'بخش جدید (مثلاً کارهای روزانه)...';
        });
    // ورودی افزودن لیست
    const projectNameInput = document.getElementById('project-name-input');
    if (projectNameInput) projectNameInput.placeholder = lang === 'en' ? 'New list ...' : 'لیست جدید ...';
  });

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
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['projects'], (res) => {
      const projects = res.projects || [];
      projects.push({ title });
      chrome.storage.sync.set({ projects }, () => {
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

  // --- Targets Section ---
  renderTargets();
  document.getElementById('add-target-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('target-input');
    const title = input.value.trim();
    if (!title) return;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['targets'], (res) => {
      const targets = res.targets || [];
      targets.push({ title });
      chrome.storage.sync.set({ targets }, () => {
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

// تابع ساخت SVG آیکون حذف مدرن
function createDeleteIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('fill', 'none');
  svg.innerHTML = `
    <rect x="5.5" y="8.5" width="1.5" height="6" rx="0.75" fill="currentColor"/>
    <rect x="9.25" y="8.5" width="1.5" height="6" rx="0.75" fill="currentColor"/>
    <rect x="13" y="8.5" width="1.5" height="6" rx="0.75" fill="currentColor"/>
    <path d="M4 6.5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="7" y="3" width="6" height="2" rx="1" fill="currentColor"/>
    <rect x="3.5" y="6.5" width="13" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
  `;
  return svg;
} 
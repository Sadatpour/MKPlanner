// checklist.js
export function renderChecklist(container) {
  container.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'چک‌لیست پروژه';
  container.appendChild(title);
  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.gap = '8px';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'آیتم جدید...';
  input.required = true;
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = '+';
  form.appendChild(input);
  form.appendChild(btn);
  container.appendChild(form);
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  container.appendChild(ul);
  let items = [];
  function save() {
    chrome.storage.sync.set({ checklist: items });
  }
  function load() {
    chrome.storage.sync.get(['checklist'], (res) => {
      items = res.checklist || [];
      render();
    });
  }
  function render() {
    ul.innerHTML = '';
    items.forEach((item, i) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = item.done;
      cb.onchange = () => {
        items[i].done = cb.checked;
        save();
        render();
      };
      const span = document.createElement('span');
      span.textContent = item.text;
      span.style.margin = '0 8px';
      if (item.done) span.style.textDecoration = 'line-through';
      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '';
      del.appendChild(createDeleteIcon());
      del.onclick = () => {
        items.splice(i, 1);
        save();
        render();
      };
      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      ul.appendChild(li);
    });
  }
  form.onsubmit = (e) => {
    e.preventDefault();
    items.push({ text: input.value.trim(), done: false });
    input.value = '';
    save();
    render();
  };
  load();
}

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
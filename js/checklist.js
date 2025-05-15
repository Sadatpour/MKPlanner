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
      del.textContent = '🗑️';
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
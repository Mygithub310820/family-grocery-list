let items = JSON.parse(localStorage.getItem('grocery-items') || '[]');
let currentFilter = 'all';

function save() {
  localStorage.setItem('grocery-items', JSON.stringify(items));
}

function addItem() {
  const nameInput = document.getElementById('item-input');
  const categorySelect = document.getElementById('category-select');
  const qtyInput = document.getElementById('qty-input');

  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = '#ff5c5c';
    setTimeout(() => nameInput.style.borderColor = '', 1000);
    return;
  }

  items.push({
    id: Date.now(),
    name,
    category: categorySelect.value,
    qty: parseInt(qtyInput.value) || 1,
    done: false,
  });

  nameInput.value = '';
  qtyInput.value = '1';
  nameInput.focus();
  save();
  render();
}

function toggleItem(id) {
  const item = items.find(i => i.id === id);
  if (item) item.done = !item.done;
  save();
  render();
}

function deleteItem(id) {
  items = items.filter(i => i.id !== id);
  save();
  render();
}

function clearDone() {
  if (!items.some(i => i.done)) return;
  if (!confirm('Удалить все купленные продукты?')) return;
  items = items.filter(i => !i.done);
  save();
  render();
}

function clearAll() {
  if (!items.length) return;
  if (!confirm('Очистить весь список?')) return;
  items = [];
  save();
  render();
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function render() {
  const container = document.getElementById('list-container');
  const statsText = document.getElementById('stats-text');
  const progressFill = document.getElementById('progress-fill');

  const done = items.filter(i => i.done).length;
  const total = items.length;
  statsText.textContent = `${done} из ${total} куплено`;
  progressFill.style.width = total ? `${(done / total) * 100}%` : '0%';

  let filtered = items;
  if (currentFilter === 'active') filtered = items.filter(i => !i.done);
  if (currentFilter === 'done') filtered = items.filter(i => i.done);

  if (!filtered.length) {
    const messages = {
      all: { icon: '🛒', text: 'Список пуст — добавьте первый продукт!' },
      active: { icon: '✅', text: 'Все продукты куплены!' },
      done: { icon: '📋', text: 'Ещё ничего не куплено' },
    };
    const m = messages[currentFilter];
    container.innerHTML = `<div class="empty-state"><div class="icon">${m.icon}</div><p>${m.text}</p></div>`;
    return;
  }

  const groups = {};
  filtered.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  container.innerHTML = Object.entries(groups).map(([cat, catItems]) => `
    <div class="category-group">
      <div class="category-header">${cat}</div>
      ${catItems.map(item => `
        <div class="item ${item.done ? 'done' : ''}" id="item-${item.id}">
          <div class="item-check" onclick="toggleItem(${item.id})"></div>
          <div class="item-info">
            <div class="item-name">${escHtml(item.name)}</div>
            <div class="item-qty">${item.qty} шт.</div>
          </div>
          <button class="item-delete" onclick="deleteItem(${item.id})" title="Удалить">✕</button>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

document.getElementById('item-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
});

render();

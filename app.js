// ── Firebase config (заполните своими данными) ─────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyA2nd4cEt_jEDCzmLxkbK4ahm1KDNEQeeA",
  authDomain:        "family-grocery-2fd4f.firebaseapp.com",
  databaseURL:       "https://family-grocery-2fd4f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "family-grocery-2fd4f",
  storageBucket:     "family-grocery-2fd4f.firebasestorage.app",
  messagingSenderId: "165693517574",
  appId:             "1:165693517574:web:3fed23201fa92c4f01f887",
};

// ── Пользователи с паролями ────────────────────────────────────────────────
const USERS = [
  { id: 1, name: 'Papa',   emoji: '👨', role: 'admin', password: 'Asdfg%6'   },
  { id: 2, name: 'Mama',   emoji: '👩', role: 'admin', password: 'SuluQyz18' },
  { id: 3, name: 'Azheka', emoji: '👦', role: 'user',  password: 'A1939'     },
  { id: 4, name: 'Amina',  emoji: '👧', role: 'user',  password: 'Kolbasa'   },
  { id: 5, name: 'Dauka',  emoji: '👦', role: 'user',  password: 'NaglMurs'  },
];

const CATEGORIES = [
  '🥬 Овощи и фрукты', '🥩 Мясо и рыба', '🥛 Молочное',
  '🍞 Хлеб и выпечка', '🧴 Бытовая химия', '🥫 Бакалея',
  '🍬 Сладости', '🧃 Напитки', '❓ Другое',
];
const UNITS = ['шт.', 'кг', 'г', 'л', 'мл', 'упак.', 'пач.'];

// ── Состояние ──────────────────────────────────────────────────────────────
let items         = [];           // синхронизируется с Firebase
let itemHistory   = JSON.parse(localStorage.getItem('grocery-history') || '[]');
let currentUserId = JSON.parse(localStorage.getItem('grocery-session') || 'null');
let darkMode      = localStorage.getItem('grocery-dark') === 'true';
let currentFilter = 'all';
let editingId     = null;
let dragSrcId     = null;
let selectedUserId = null;
let dbRef         = null;         // ссылка на Firebase Realtime Database

// ── Firebase инициализация ─────────────────────────────────────────────────
function initFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG);
  dbRef = firebase.database().ref('items');

  // Слушаем изменения в реальном времени
  dbRef.on('value', snapshot => {
    const data = snapshot.val();
    items = data ? Object.values(data) : [];
    // Сортируем по order (для drag & drop)
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    render();
  });
}

// ── Сохранение в Firebase ──────────────────────────────────────────────────
function saveItems() {
  // Конвертируем массив в объект {id: item}
  const obj = {};
  items.forEach((item, idx) => {
    item.order = idx;
    obj[item.id] = item;
  });
  dbRef.set(obj);
}

// ── Инициализация UI ──────────────────────────────────────────────────────
function init() {
  if (darkMode) document.body.classList.add('dark');
  populateSelects();
  initFirebase();

  if (currentUserId && USERS.find(u => u.id === currentUserId)) {
    showApp();
  } else {
    currentUserId = null;
    showLogin();
  }
}

function populateSelects() {
  const catOpts  = CATEGORIES.map(c => `<option value="${esc(c)}">${c}</option>`).join('');
  const unitOpts = UNITS.map(u => `<option value="${esc(u)}">${u}</option>`).join('');
  document.getElementById('category-select').innerHTML = catOpts;
  document.getElementById('edit-category').innerHTML   = catOpts;
  document.getElementById('unit-select').innerHTML     = unitOpts;
  document.getElementById('edit-unit').innerHTML       = unitOpts;
}

// ── Экран входа ────────────────────────────────────────────────────────────
function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.querySelector('.app').classList.add('hidden');
  showStep1();
}

function showStep1() {
  selectedUserId = null;
  document.getElementById('login-step1').classList.remove('hidden');
  document.getElementById('login-step2').classList.add('hidden');
  document.getElementById('user-list').innerHTML = USERS.map(u => `
    <div class="user-card" onclick="selectUser(${u.id})">
      <div class="user-emoji">${u.emoji}</div>
      <div class="user-name">${esc(u.name)}</div>
      ${u.role === 'admin' ? '<div class="user-role-badge">Администратор</div>' : ''}
    </div>
  `).join('');
}

function selectUser(id) {
  selectedUserId = id;
  const u = USERS.find(u => u.id === id);
  document.getElementById('sel-emoji').textContent = u.emoji;
  document.getElementById('sel-name').textContent  = u.name;
  document.getElementById('password-input').value  = '';
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('login-step1').classList.add('hidden');
  document.getElementById('login-step2').classList.remove('hidden');
  setTimeout(() => document.getElementById('password-input').focus(), 50);
}

function backToUsers() { showStep1(); }

function tryLogin() {
  const u = USERS.find(u => u.id === selectedUserId);
  const entered = document.getElementById('password-input').value;
  if (u && entered === u.password) {
    currentUserId = u.id;
    localStorage.setItem('grocery-session', JSON.stringify(u.id));
    showApp();
  } else {
    const err = document.getElementById('login-error');
    err.classList.remove('hidden');
    const inp = document.getElementById('password-input');
    inp.classList.add('error');
    inp.value = '';
    inp.focus();
    setTimeout(() => { inp.classList.remove('error'); err.classList.add('hidden'); }, 2000);
  }
}

function togglePwdVisibility() {
  const inp = document.getElementById('password-input');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function logout() {
  if (!confirm('Выйти из аккаунта?')) return;
  currentUserId = null;
  localStorage.removeItem('grocery-session');
  showLogin();
}

// ── Основное приложение ────────────────────────────────────────────────────
function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.querySelector('.app').classList.remove('hidden');
  updateUserDisplay();
  // render() вызовется автоматически через dbRef.on('value')
}

function me()      { return USERS.find(u => u.id === currentUserId); }
function isAdmin() { const u = me(); return u && u.role === 'admin'; }

function updateUserDisplay() {
  const u = me();
  if (u) document.getElementById('current-user-display').textContent = `${u.emoji} ${u.name}`;
  document.querySelector('.dark-toggle').textContent = darkMode ? '☀️' : '🌙';
  document.getElementById('footer-actions').style.display = isAdmin() ? 'flex' : 'none';
}

// ── Тёмная тема ────────────────────────────────────────────────────────────
function toggleDark() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);
  localStorage.setItem('grocery-dark', String(darkMode));
  document.querySelector('.dark-toggle').textContent = darkMode ? '☀️' : '🌙';
}

// ── CRUD продуктов ─────────────────────────────────────────────────────────
function addItem() {
  const nameInput = document.getElementById('item-input');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('error');
    setTimeout(() => nameInput.classList.remove('error'), 800);
    nameInput.focus();
    return;
  }
  const category = document.getElementById('category-select').value;
  const qty      = parseInt(document.getElementById('qty-input').value) || 1;
  const unit     = document.getElementById('unit-select').value;
  const id       = Date.now();

  const newItem = { id, name, category, qty, unit, done: false, addedBy: currentUserId, order: items.length };
  // Добавляем сразу в Firebase
  dbRef.child(String(id)).set(newItem);

  if (!itemHistory.includes(name)) {
    itemHistory.unshift(name);
    if (itemHistory.length > 100) itemHistory.pop();
    localStorage.setItem('grocery-history', JSON.stringify(itemHistory));
  }

  nameInput.value = '';
  document.getElementById('qty-input').value = '1';
  hideAutocomplete();
  nameInput.focus();
}

function toggleItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  dbRef.child(String(id)).update({ done: !item.done });
}

function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!isAdmin() && item.addedBy !== currentUserId) {
    alert('Вы можете удалять только свои продукты');
    return;
  }
  dbRef.child(String(id)).remove();
}

function clearDone() {
  if (!items.some(i => i.done)) return;
  if (!confirm('Удалить все купленные продукты?')) return;
  const updates = {};
  items.filter(i => i.done).forEach(i => { updates[String(i.id)] = null; });
  dbRef.update(updates);
}

function clearAll() {
  if (!items.length) return;
  if (!confirm('Очистить весь список?')) return;
  dbRef.set(null);
}

// ── Редактирование ─────────────────────────────────────────────────────────
function openEdit(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!isAdmin() && item.addedBy !== currentUserId) {
    alert('Вы можете редактировать только свои продукты');
    return;
  }
  editingId = id;
  document.getElementById('edit-name').value     = item.name;
  document.getElementById('edit-category').value = item.category;
  document.getElementById('edit-qty').value      = item.qty;
  document.getElementById('edit-unit').value     = item.unit || 'шт.';
  document.getElementById('edit-modal').classList.remove('hidden');
  document.getElementById('edit-name').focus();
}

function closeEdit() {
  editingId = null;
  document.getElementById('edit-modal').classList.add('hidden');
}

function saveEdit() {
  if (!editingId) return;
  const name = document.getElementById('edit-name').value.trim();
  if (!name) return;
  dbRef.child(String(editingId)).update({
    name,
    category: document.getElementById('edit-category').value,
    qty:      parseInt(document.getElementById('edit-qty').value) || 1,
    unit:     document.getElementById('edit-unit').value,
  });
  closeEdit();
}

// ── Автодополнение ─────────────────────────────────────────────────────────
document.getElementById('item-input').addEventListener('input', function () {
  const val = this.value.trim().toLowerCase();
  if (!val) { hideAutocomplete(); return; }
  const matches = itemHistory.filter(h => h.toLowerCase().includes(val)).slice(0, 6);
  if (!matches.length) { hideAutocomplete(); return; }
  const list = document.getElementById('autocomplete-list');
  list.innerHTML = matches.map(m =>
    `<div class="ac-item" data-name="${esc(m)}" onclick="pickAutocomplete(this)">${esc(m)}</div>`
  ).join('');
  list.classList.remove('hidden');
});

function pickAutocomplete(el) {
  document.getElementById('item-input').value = el.dataset.name;
  hideAutocomplete();
  document.getElementById('item-input').focus();
}

function hideAutocomplete() {
  document.getElementById('autocomplete-list').classList.add('hidden');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.input-wrap')) hideAutocomplete();
});

// ── Фильтры ────────────────────────────────────────────────────────────────
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

// ── Drag & Drop ────────────────────────────────────────────────────────────
function setupDragDrop() {
  document.querySelectorAll('.item[data-id]').forEach(el => {
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragover',  onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop',      onDrop);
    el.addEventListener('dragend',   onDragEnd);
  });
}

function onDragStart(e) {
  dragSrcId = parseInt(this.dataset.id);
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}
function onDragLeave() { this.classList.remove('drag-over'); }
function onDrop(e) {
  e.stopPropagation();
  this.classList.remove('drag-over');
  const targetId = parseInt(this.dataset.id);
  if (!dragSrcId || dragSrcId === targetId) return;
  const srcIdx = items.findIndex(i => i.id === dragSrcId);
  const tgtIdx = items.findIndex(i => i.id === targetId);
  if (srcIdx === -1 || tgtIdx === -1) return;
  const [moved] = items.splice(srcIdx, 1);
  items.splice(tgtIdx, 0, moved);
  saveItems();
}
function onDragEnd() {
  document.querySelectorAll('.item').forEach(el =>
    el.classList.remove('dragging', 'drag-over')
  );
  dragSrcId = null;
}

// ── Рендер ─────────────────────────────────────────────────────────────────
function render() {
  // Если приложение ещё не показано — не рендерим список
  if (document.querySelector('.app').classList.contains('hidden')) return;

  const container    = document.getElementById('list-container');
  const statsText    = document.getElementById('stats-text');
  const progressFill = document.getElementById('progress-fill');

  const done  = items.filter(i => i.done).length;
  const total = items.length;
  statsText.textContent    = `${done} из ${total} куплено`;
  progressFill.style.width = total ? `${(done / total) * 100}%` : '0%';

  // Обычные пользователи видят только свои продукты
  let filtered = isAdmin() ? items : items.filter(i => i.addedBy === currentUserId);
  if (currentFilter === 'active') filtered = filtered.filter(i => !i.done);
  if (currentFilter === 'done')   filtered = filtered.filter(i => i.done);

  if (!filtered.length) {
    const msgs = {
      all:    { icon: '🛒', text: 'Список пуст — добавьте первый продукт!' },
      active: { icon: '✅', text: 'Все продукты куплены!' },
      done:   { icon: '📋', text: 'Ещё ничего не куплено' },
    };
    const m = msgs[currentFilter];
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
      ${catItems.map(item => {
        const author  = USERS.find(u => u.id === item.addedBy);
        const canEdit = isAdmin() || item.addedBy === currentUserId;
        return `
          <div class="item ${item.done ? 'done' : ''}" data-id="${item.id}" draggable="true">
            <div class="drag-handle" title="Перетащить">⠿</div>
            <div class="item-check" onclick="toggleItem(${item.id})"></div>
            <div class="item-info">
              <div class="item-name">${esc(item.name)}</div>
              <div class="item-meta">
                <span class="item-qty">${item.qty} ${item.unit || 'шт.'}</span>
                ${author ? `<span class="item-author">${author.emoji} ${esc(author.name)}</span>` : ''}
              </div>
            </div>
            <div class="item-actions">
              ${canEdit ? `<button class="item-edit"   onclick="openEdit(${item.id})"   title="Редактировать">✏️</button>` : ''}
              ${canEdit ? `<button class="item-delete" onclick="deleteItem(${item.id})" title="Удалить">✕</button>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');

  setupDragDrop();
  // Обновляем видимость admin-кнопок после render
  document.getElementById('footer-actions').style.display = isAdmin() ? 'flex' : 'none';
}

// ── Вспомогательные ────────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Клавиатура ─────────────────────────────────────────────────────────────
document.getElementById('item-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
  if (e.key === 'Escape') hideAutocomplete();
});
document.getElementById('password-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
  if (e.key === 'Escape') backToUsers();
});
document.getElementById('edit-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveEdit();
  if (e.key === 'Escape') closeEdit();
});
document.getElementById('edit-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('edit-modal')) closeEdit();
});

// ── Старт ──────────────────────────────────────────────────────────────────
init();

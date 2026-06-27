// ── Firebase config ────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyA2nd4cEt_jEDCzmLxkbK4ahm1KDNEQeeA",
  authDomain:        "family-grocery-2fd4f.firebaseapp.com",
  databaseURL:       "https://family-grocery-2fd4f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "family-grocery-2fd4f",
  storageBucket:     "family-grocery-2fd4f.firebasestorage.app",
  messagingSenderId: "165693517574",
  appId:             "1:165693517574:web:3fed23201fa92c4f01f887",
};

// ── Пользователи ───────────────────────────────────────────────────────────
const USERS = [
  { id: 1, name: 'Papa',   emoji: '👨', role: 'admin', password: 'Asdfg%6',   seeAll: true  },
  { id: 2, name: 'Mama',   emoji: '👩', role: 'admin', password: 'SuluQyz18', seeAll: true  },
  { id: 3, name: 'Azheka', emoji: '👧', role: 'user',  password: 'A1939',     seeAll: false },
  { id: 4, name: 'Amina',  emoji: '👧', role: 'user',  password: 'Kolbasa',   seeAll: true  },
  { id: 5, name: 'Dauka',  emoji: '👦', role: 'user',  password: 'NaglMurs',  seeAll: true  },
];

// ── Категории и популярные товары ──────────────────────────────────────────
const CATEGORIES = [
  '🥬 Овощи и фрукты', '🥩 Мясо и рыба', '🥛 Молочное',
  '🍞 Хлеб и выпечка', '🧴 Бытовая химия', '🥫 Бакалея',
  '🍬 Сладости', '🧃 Напитки', '❓ Другое',
];
const UNITS = ['шт.', 'кг', 'г', 'л', 'мл', 'упак.', 'пач.'];

const POPULAR = {
  '🥬 Овощи и фрукты': ['Апельсины', 'Бананы', 'Капуста', 'Картофель', 'Лук', 'Морковь', 'Огурцы', 'Перец болгарский', 'Помидоры', 'Чеснок', 'Яблоки'],
  '🥩 Мясо и рыба':    ['Баранина', 'Говядина', 'Жая', 'Казы', 'Карта', 'Колбаса', 'Креветки', 'Курица', 'Лосось', 'Субпродукты', 'Фарш'],
  '🥛 Молочное':       ['Масло сливочное', 'Молоко', 'Сливки', 'Сметана', 'Соевый сомоком', 'Творог', 'Яйца', 'Cheese Sveza', 'Halloumi', 'Stracciatella', 'Сыр'],
  '🍞 Хлеб и выпечка': ['Багет', 'Батон', 'Булочки', 'Круассаны', 'Лаваш', 'Пита', 'Слойки', 'Тосты', 'Хлеб белый', 'Хлеб чёрный', 'Хлебцы'],
  '🧴 Бытовая химия':  ['Гель для душа', 'Губки для посуды', 'Зубная паста', 'Кондиционер для белья', 'Мыло', 'Освежитель воздуха', 'Порошок стиральный', 'Салфетки', 'Средство для посуды', 'Туалетная бумага', 'Шампунь'],
  '🥫 Бакалея':        ['Геркулес', 'Гречка', 'Консервы рыбные', 'Макароны', 'Мука', 'Подсолнечное масло', 'Рис', 'Соль', 'Сахар', 'Тушёнка', 'Чечевица'],
  '🍬 Сладости':       ['Вафли', 'Зефир', 'Карамель', 'Конфеты', 'Мармелад', 'Пастила', 'Печенье', 'Пряники', 'Торт', 'Халва', 'Шоколад'],
  '🧃 Напитки':        ['Вода питьевая', 'Газировка', 'Какао', 'Квас', 'Кофе', 'Компот', 'Лимонад', 'Морс', 'Сок', 'Чай', 'Энергетик'],
  '❓ Другое':         [],
};

// ── Состояние ──────────────────────────────────────────────────────────────
let items         = [];
let historyData   = {};   // {itemId: {name,qty,unit,price,category,addedBy,completedAt}}
let prices        = {};   // {priceKey: price}
let itemHistory   = JSON.parse(localStorage.getItem('grocery-history') || '[]');
let currentUserId = JSON.parse(localStorage.getItem('grocery-session') || 'null');
let darkMode      = localStorage.getItem('grocery-dark') === 'true';
let currentFilter = 'all';
let editingId     = null;
let dragSrcId     = null;
let selectedUserId = null;
let statsPeriod   = 'today';

let dbRef, historyRef, pricesRef;

// ── Firebase ───────────────────────────────────────────────────────────────
function initFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG);
  dbRef      = firebase.database().ref('items');
  historyRef = firebase.database().ref('history');
  pricesRef  = firebase.database().ref('prices');

  dbRef.on('value', snapshot => {
    const data = snapshot.val();
    items = data ? Object.values(data) : [];
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    render();
  });

  historyRef.on('value', snapshot => {
    historyData = snapshot.val() || {};
  });

  pricesRef.on('value', snapshot => {
    prices = snapshot.val() || {};
  });
}

function priceKey(name) {
  return name.trim().toLowerCase().replace(/[^a-zа-яё0-9]/gi, '_');
}

function saveItems() {
  const obj = {};
  items.forEach((item, idx) => { item.order = idx; obj[item.id] = item; });
  dbRef.set(obj);
}

// ── Инициализация ──────────────────────────────────────────────────────────
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
  updatePopular();
}

// ── Авторизация ────────────────────────────────────────────────────────────
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
  const u       = USERS.find(u => u.id === selectedUserId);
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

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.querySelector('.app').classList.remove('hidden');
  updateUserDisplay();
}

function me()        { return USERS.find(u => u.id === currentUserId); }
function isAdmin()   { const u = me(); return u && u.role === 'admin'; }
function canSeeAll() { const u = me(); return u && (u.role === 'admin' || u.seeAll); }
function canManage(item) { return isAdmin() || item.addedBy === currentUserId; }

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

// ── Популярные товары ──────────────────────────────────────────────────────
function updatePopular() {
  const cat     = document.getElementById('category-select').value;
  const popular = POPULAR[cat] || [];
  const sel     = document.getElementById('popular-select');
  sel.innerHTML = `<option value="">-- выбрать из списка:</option>`
    + popular.map(p => `<option value="${esc(p)}">${p}</option>`).join('')
    + `<option value="__manual__">✏️ Ввести вручную...</option>`;
  document.getElementById('item-input').value  = '';
  document.getElementById('price-input').value = '';
  document.getElementById('manual-wrap').classList.add('hidden');
  hideAutocomplete();
}

function pickPopular() {
  const val    = document.getElementById('popular-select').value;
  const manual = document.getElementById('manual-wrap');
  const input  = document.getElementById('item-input');
  if (val === '__manual__') {
    manual.classList.remove('hidden');
    input.value = '';
    document.getElementById('price-input').value = '';
    setTimeout(() => input.focus(), 50);
  } else if (val) {
    manual.classList.add('hidden');
    input.value = val;
    fillPrice(val);
  } else {
    manual.classList.add('hidden');
    input.value = '';
    document.getElementById('price-input').value = '';
  }
}

function fillPrice(name) {
  const p = prices[priceKey(name)];
  document.getElementById('price-input').value = p ? p : '';
}

// ── CRUD продуктов ─────────────────────────────────────────────────────────
function addItem() {
  const nameInput  = document.getElementById('item-input');
  const popSel     = document.getElementById('popular-select');
  // Имя берём из ручного поля или из популярного выбора
  const name = nameInput.value.trim() || (popSel.value && popSel.value !== '__manual__' ? popSel.value : '');
  if (!name) {
    nameInput.classList.add('error');
    setTimeout(() => nameInput.classList.remove('error'), 800);
    return;
  }
  const category = document.getElementById('category-select').value;
  const qty      = parseInt(document.getElementById('qty-input').value) || 1;
  const unit     = document.getElementById('unit-select').value;
  const priceVal = parseFloat(document.getElementById('price-input').value) || null;
  const id       = Date.now();

  // Запоминаем цену
  if (priceVal) pricesRef.child(priceKey(name)).set(priceVal);

  dbRef.child(String(id)).set({
    id, name, category, qty, unit,
    price: priceVal,
    done: false,
    addedBy: currentUserId,
    order: items.length,
  });

  if (!itemHistory.includes(name)) {
    itemHistory.unshift(name);
    if (itemHistory.length > 100) itemHistory.pop();
    localStorage.setItem('grocery-history', JSON.stringify(itemHistory));
  }

  // Сброс формы
  nameInput.value = '';
  document.getElementById('qty-input').value    = '1';
  document.getElementById('price-input').value  = '';
  document.getElementById('popular-select').value = '';
  document.getElementById('manual-wrap').classList.add('hidden');
  hideAutocomplete();
}

function toggleItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  const nowDone = !item.done;
  dbRef.child(String(id)).update({ done: nowDone });

  if (nowDone) {
    // Сохраняем в историю покупок
    historyRef.child(String(id)).set({
      itemId:      id,
      name:        item.name,
      category:    item.category,
      qty:         item.qty,
      unit:        item.unit || 'шт.',
      price:       item.price || null,
      addedBy:     item.addedBy,
      completedAt: Date.now(),
    });
  } else {
    // Отменяем покупку — убираем из истории
    historyRef.child(String(id)).remove();
  }
}

function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!canManage(item)) { alert('Вы можете удалять только свои продукты'); return; }
  dbRef.child(String(id)).remove();
  // Если был помечен куплено и вручную удалили — убираем из истории
  if (item.done) historyRef.child(String(id)).remove();
}

function clearDone() {
  if (!items.some(i => i.done)) return;
  if (!confirm('Удалить все купленные из списка?\n(История покупок сохранится)')) return;
  const updates = {};
  items.filter(i => i.done).forEach(i => { updates[String(i.id)] = null; });
  dbRef.update(updates);
  // История НЕ очищается — это записи о покупках
}

function clearAll() {
  if (!items.length) return;
  if (!confirm('Очистить весь список?\n(История покупок сохранится)')) return;
  items.filter(i => i.done).forEach(i => historyRef.child(String(i.id)).remove());
  dbRef.set(null);
}

// ── Редактирование ─────────────────────────────────────────────────────────
function openEdit(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!canManage(item)) { alert('Вы можете редактировать только свои продукты'); return; }
  editingId = id;
  document.getElementById('edit-name').value     = item.name;
  document.getElementById('edit-category').value = item.category;
  document.getElementById('edit-qty').value      = item.qty;
  document.getElementById('edit-unit').value     = item.unit || 'шт.';
  document.getElementById('edit-price').value    = item.price || '';
  document.getElementById('edit-modal').classList.remove('hidden');
  document.getElementById('edit-name').focus();
}

function closeEdit() {
  editingId = null;
  document.getElementById('edit-modal').classList.add('hidden');
}

function saveEdit() {
  if (!editingId) return;
  const name     = document.getElementById('edit-name').value.trim();
  if (!name) return;
  const priceVal = parseFloat(document.getElementById('edit-price').value) || null;
  if (priceVal) pricesRef.child(priceKey(name)).set(priceVal);
  dbRef.child(String(editingId)).update({
    name,
    category: document.getElementById('edit-category').value,
    qty:      parseInt(document.getElementById('edit-qty').value) || 1,
    unit:     document.getElementById('edit-unit').value,
    price:    priceVal,
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
  const name = el.dataset.name;
  document.getElementById('item-input').value = name;
  fillPrice(name);
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
function onDragStart(e) { dragSrcId = parseInt(this.dataset.id); this.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
function onDragOver(e)  { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; this.classList.add('drag-over'); }
function onDragLeave()  { this.classList.remove('drag-over'); }
function onDrop(e) {
  e.stopPropagation(); this.classList.remove('drag-over');
  const targetId = parseInt(this.dataset.id);
  if (!dragSrcId || dragSrcId === targetId) return;
  const si = items.findIndex(i => i.id === dragSrcId);
  const ti = items.findIndex(i => i.id === targetId);
  if (si === -1 || ti === -1) return;
  const [moved] = items.splice(si, 1);
  items.splice(ti, 0, moved);
  saveItems();
}
function onDragEnd() {
  document.querySelectorAll('.item').forEach(el => el.classList.remove('dragging', 'drag-over'));
  dragSrcId = null;
}

// ── Рендер ─────────────────────────────────────────────────────────────────
function render() {
  if (document.querySelector('.app').classList.contains('hidden')) return;

  const done  = items.filter(i => i.done).length;
  const total = items.length;
  document.getElementById('stats-text').textContent    = `${done} из ${total} куплено`;
  document.getElementById('progress-fill').style.width = total ? `${(done / total) * 100}%` : '0%';

  let visible  = canSeeAll() ? items : items.filter(i => i.addedBy === currentUserId);
  let filtered = visible;
  if (currentFilter === 'active') filtered = visible.filter(i => !i.done);
  if (currentFilter === 'done')   filtered = visible.filter(i => i.done);

  const container = document.getElementById('list-container');
  if (!filtered.length) {
    const msgs = {
      all:    { icon: '🛒', text: 'Список пуст — добавьте первый продукт!' },
      active: { icon: '✅', text: 'Все продукты куплены!' },
      done:   { icon: '📋', text: 'Ещё ничего не куплено' },
    };
    const m = msgs[currentFilter];
    container.innerHTML = `<div class="empty-state"><div class="icon">${m.icon}</div><p>${m.text}</p></div>`;
    document.getElementById('footer-actions').style.display = isAdmin() ? 'flex' : 'none';
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
        const author = USERS.find(u => u.id === item.addedBy);
        const cm     = canManage(item);
        const priceStr = item.price ? `<span class="item-price">${(item.price * item.qty).toLocaleString('ru')} ₸</span>` : '';
        return `
          <div class="item ${item.done ? 'done' : ''}" data-id="${item.id}" draggable="true">
            <div class="drag-handle">⠿</div>
            <div class="item-check" onclick="toggleItem(${item.id})"></div>
            <div class="item-info">
              <div class="item-name">${esc(item.name)}</div>
              <div class="item-meta">
                <span class="item-qty">${item.qty} ${item.unit || 'шт.'}</span>
                ${priceStr}
                ${author ? `<span class="item-author">${author.emoji} ${esc(author.name)}</span>` : ''}
              </div>
            </div>
            <div class="item-actions">
              ${cm ? `<button class="item-edit"   onclick="openEdit(${item.id})"   title="Редактировать">✏️</button>` : ''}
              ${cm ? `<button class="item-delete" onclick="deleteItem(${item.id})" title="Удалить">✕</button>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>
  `).join('');

  setupDragDrop();
  document.getElementById('footer-actions').style.display = isAdmin() ? 'flex' : 'none';
}

// ── Статистика ─────────────────────────────────────────────────────────────
function openStats() {
  renderStats();
  document.getElementById('stats-modal').classList.remove('hidden');
}

function closeStats() {
  document.getElementById('stats-modal').classList.add('hidden');
}

function setStatsPeriod(period, btn) {
  statsPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('custom-period').classList.toggle('hidden', period !== 'custom');
  if (period !== 'custom') renderStats();
}

function renderStats() {
  const now = Date.now();
  let fromTs, toTs = now;

  if (statsPeriod === 'today') {
    fromTs = new Date().setHours(0, 0, 0, 0);
  } else if (statsPeriod === 'week') {
    fromTs = now - 7 * 864e5;
  } else if (statsPeriod === 'month') {
    fromTs = now - 30 * 864e5;
  } else if (statsPeriod === 'year') {
    fromTs = now - 365 * 864e5;
  } else {
    const df = document.getElementById('date-from').value;
    const dt = document.getElementById('date-to').value;
    if (!df || !dt) return;
    fromTs = new Date(df).getTime();
    toTs   = new Date(dt).getTime() + 864e5 - 1;
  }

  // Фильтр по времени
  let entries = Object.values(historyData).filter(h =>
    h.completedAt >= fromTs && h.completedAt <= toTs
  );

  // Фильтр по правам
  if (!canSeeAll()) {
    entries = entries.filter(h => h.addedBy === currentUserId);
  }

  const el = document.getElementById('stats-content');
  if (!entries.length) {
    el.innerHTML = `<div class="stats-empty">Нет данных за выбранный период</div>`;
    return;
  }

  const totalCount = entries.length;
  const totalSpend = entries.reduce((s, h) => s + (h.price ? h.price * h.qty : 0), 0);

  // По категориям
  const byCat = {};
  entries.forEach(h => {
    if (!byCat[h.category]) byCat[h.category] = { count: 0, spend: 0 };
    byCat[h.category].count++;
    byCat[h.category].spend += h.price ? h.price * h.qty : 0;
  });

  // По пользователям (если видно всех)
  const byUser = {};
  if (canSeeAll()) {
    entries.forEach(h => {
      const k = h.addedBy;
      if (!byUser[k]) byUser[k] = { count: 0, spend: 0 };
      byUser[k].count++;
      byUser[k].spend += h.price ? h.price * h.qty : 0;
    });
  }

  const fmt = n => n > 0 ? `${n.toLocaleString('ru')} ₸` : '—';

  let html = `
    <div class="stats-summary">
      <div class="stats-card">
        <div class="stats-value">${totalCount}</div>
        <div class="stats-label">позиций куплено</div>
      </div>
      ${totalSpend > 0 ? `
      <div class="stats-card accent">
        <div class="stats-value">${fmt(totalSpend)}</div>
        <div class="stats-label">потрачено</div>
      </div>` : ''}
    </div>

    <div class="stats-section-title">По категориям</div>
    <div class="stats-table">
      ${Object.entries(byCat).map(([cat, d]) => `
        <div class="stats-row">
          <span class="stats-cat">${cat}</span>
          <span class="stats-count">${d.count} поз.</span>
          <span class="stats-spend">${fmt(d.spend)}</span>
        </div>`).join('')}
    </div>`;

  if (canSeeAll() && Object.keys(byUser).length > 0) {
    html += `
    <div class="stats-section-title">По пользователям</div>
    <div class="stats-table">
      ${Object.entries(byUser).map(([uid, d]) => {
        const u = USERS.find(u => u.id === parseInt(uid));
        return u ? `
        <div class="stats-row">
          <span class="stats-cat">${u.emoji} ${esc(u.name)}</span>
          <span class="stats-count">${d.count} поз.</span>
          <span class="stats-spend">${fmt(d.spend)}</span>
        </div>` : '';
      }).join('')}
    </div>`;
  }

  el.innerHTML = html;
}

// ── Вспомогательные ────────────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
document.getElementById('stats-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('stats-modal')) closeStats();
});

// ── Старт ──────────────────────────────────────────────────────────────────
init();

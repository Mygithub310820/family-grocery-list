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

// ── Категории, единицы, популярные товары ──────────────────────────────────
const CATEGORIES = [
  '🥬 Овощи и фрукты', '🥩 Мясо и рыба', '🥛 Молочное',
  '🍞 Хлеб и выпечка', '🧴 Бытовая химия', '🥫 Бакалея',
  '🍬 Сладости', '🧃 Напитки', '❓ Другое',
];
const UNITS = ['шт.', 'кг', 'г', 'л', 'мл', 'упак.', 'пач.'];

// '---' — разделитель (пунктирная линия)
const POPULAR = {
  '🥬 Овощи и фрукты': ['Апельсины','Бананы','Капуста','Картофель','Лук','Морковь','Огурцы','Перец болгарский','Помидоры','Чеснок','Яблоки'],
  '🥩 Мясо и рыба':    ['Баранина','Говядина','Жая','Қазы','Қарта','Колбаса','Креветки','Курица','Лосось','Субпродукты','Фарш'],
  '🥛 Молочное':       ['Масло сливочное','Молоко','Сливки','Сметана','Соевый сомоком','Творог','Яйца','---','Burrata','Cheese Sveza','Halloumi','Stracciatella'],
  '🍞 Хлеб и выпечка': ['Багет','Батон','Булочки','Круассаны','Лаваш','Пита','Слойки','Тосты','Хлеб белый','Хлеб чёрный','Хлебцы'],
  '🧴 Бытовая химия':  ['Гель для душа','Губки для посуды','Зубная паста','Кондиционер для белья','Мыло','Освежитель воздуха','Порошок стиральный','Салфетки','Средство для посуды','Туалетная бумага','Шампунь'],
  '🥫 Бакалея':        ['Геркулес','Гречка','Ись','Макароны','Мука','Оливковое масло','Подсолнечное масло','Соль','Сахар','Чечевица красная','Чечевица коричневая'],
  '🍬 Сладости':       ['Вафли','Зефир','Карамель','Конфеты','Мармелад','Пастила','Печенье','Пряники','Торт','Халва','Шоколад'],
  '🧃 Напитки':        ['Боржоми','Вода без газиков','Вода с газиками','Какао','Квас','Кофе','Компот','Лимонад','Сарыағаш','Сок','Чай'],
  '❓ Другое':         [],
};

// ── Состояние ──────────────────────────────────────────────────────────────
let items         = [];
let historyData   = {};
let prices        = {};
let itemHistory   = JSON.parse(localStorage.getItem('grocery-history') || '[]');
let currentUserId = JSON.parse(localStorage.getItem('grocery-session') || 'null');
let darkMode      = localStorage.getItem('grocery-dark') === 'true';
let currentFilter = 'all';
let editingId     = null;
let dragSrcId     = null;
let selectedUserId = null;
let statsPeriod   = 'today';
let pendingDoneId = null;   // id товара ожидающего подтверждения цены

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
  historyRef.on('value', snapshot => { historyData = snapshot.val() || {}; });
  pricesRef.on('value',  snapshot => { prices      = snapshot.val() || {}; });
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
  document.getElementById('category-select').innerHTML    = catOpts;
  document.getElementById('edit-category').innerHTML      = catOpts;
  document.getElementById('unit-select').innerHTML        = unitOpts;
  document.getElementById('edit-unit').innerHTML          = unitOpts;
  document.getElementById('price-prompt-unit').innerHTML  = unitOpts;
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

function me()            { return USERS.find(u => u.id === currentUserId); }
function isAdmin()       { const u = me(); return u && u.role === 'admin'; }
function canSeeAll()     { const u = me(); return u && (u.role === 'admin' || u.seeAll); }
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

// ── Популярные товары (кнопки-чипы) ───────────────────────────────────────
function updatePopular() {
  const cat     = document.getElementById('category-select').value;
  const popular = POPULAR[cat] || [];
  const container = document.getElementById('popular-items');

  container.innerHTML = popular.map(p => {
    if (p === '---') return '<div class="popular-separator"></div>';
    return `<button class="popular-btn" data-name="${esc(p)}" onclick="pickPopularBtn(this)">${esc(p)}</button>`;
  }).join('')
  + `<button class="popular-btn manual-btn" onclick="pickManual()">✏️ Вручную</button>`;

  // Показываем/скрываем чекбокс Стекло
  const isNapitki = cat === '🧃 Напитки';
  document.getElementById('glass-option').classList.toggle('hidden', !isNapitki);
  if (!isNapitki) document.getElementById('glass-check').checked = false;

  // Сброс
  document.getElementById('item-input').value  = '';
  document.getElementById('price-input').value = '';
  document.getElementById('manual-wrap').classList.add('hidden');
  hideAutocomplete();
}

function pickPopularBtn(btn) {
  document.querySelectorAll('.popular-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const name = btn.dataset.name;
  document.getElementById('item-input').value = name;
  document.getElementById('manual-wrap').classList.add('hidden');
  fillPrice(name);
}

function pickManual() {
  document.querySelectorAll('.popular-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('.manual-btn').classList.add('selected');
  document.getElementById('manual-wrap').classList.remove('hidden');
  document.getElementById('item-input').value  = '';
  document.getElementById('price-input').value = '';
  setTimeout(() => document.getElementById('item-input').focus(), 50);
}

function fillPrice(name) {
  const p = prices[priceKey(name)];
  document.getElementById('price-input').value = p ? p : '';
}

// ── CRUD продуктов ─────────────────────────────────────────────────────────
function addItem() {
  const nameInput = document.getElementById('item-input');
  const name      = nameInput.value.trim();
  if (!name) {
    // Проверим что хоть что-то выбрано из чипов
    const selectedBtn = document.querySelector('.popular-btn.selected:not(.manual-btn)');
    if (!selectedBtn) {
      nameInput.classList.add('error');
      setTimeout(() => nameInput.classList.remove('error'), 800);
      return;
    }
  }
  const finalName = name || document.querySelector('.popular-btn.selected')?.dataset?.name || '';
  if (!finalName) return;

  const category = document.getElementById('category-select').value;
  const qty      = parseInt(document.getElementById('qty-input').value) || 1;
  const unit     = document.getElementById('unit-select').value;
  const priceVal = parseFloat(document.getElementById('price-input').value) || null;
  const glass    = document.getElementById('glass-check')?.checked || false;
  const id       = Date.now();

  if (priceVal) pricesRef.child(priceKey(finalName)).set(priceVal);

  dbRef.child(String(id)).set({
    id, name: finalName, category, qty, unit,
    price: priceVal, glass: glass || false,
    done: false, addedBy: currentUserId, order: items.length,
  });

  if (!itemHistory.includes(finalName)) {
    itemHistory.unshift(finalName);
    if (itemHistory.length > 100) itemHistory.pop();
    localStorage.setItem('grocery-history', JSON.stringify(itemHistory));
  }

  // Сброс формы
  nameInput.value = '';
  document.getElementById('qty-input').value    = '1';
  document.getElementById('price-input').value  = '';
  document.querySelectorAll('.popular-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('manual-wrap').classList.add('hidden');
  hideAutocomplete();
}

// ── Отметка куплено / запрос цены ─────────────────────────────────────────
function toggleItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.done) {
    // Снимаем отметку
    dbRef.child(String(id)).update({ done: false });
    historyRef.child(String(id)).remove();
    return;
  }

  // Отмечаем куплено
  if (!item.price) {
    // Нет цены — показываем промпт с qty/unit/price
    pendingDoneId = id;
    document.getElementById('price-prompt-name').textContent   = item.name;
    document.getElementById('price-prompt-qty').value          = item.qty || 1;
    document.getElementById('price-prompt-unit').value         = item.unit || 'шт.';
    document.getElementById('price-prompt-input').value        = '';
    document.getElementById('price-prompt').classList.remove('hidden');
    setTimeout(() => document.getElementById('price-prompt-qty').focus(), 50);
  } else {
    markItemDone(id, item.price);
  }
}

function skipPrice() {
  document.getElementById('price-prompt').classList.add('hidden');
  if (pendingDoneId !== null) markItemDone(pendingDoneId, null);
  pendingDoneId = null;
}

function confirmPrice() {
  const priceVal = parseFloat(document.getElementById('price-prompt-input').value) || null;
  const qtyVal   = parseFloat(document.getElementById('price-prompt-qty').value)   || null;
  const unitVal  = document.getElementById('price-prompt-unit').value;
  document.getElementById('price-prompt').classList.add('hidden');

  if (pendingDoneId !== null) {
    const item = items.find(i => i.id === pendingDoneId);
    if (item) {
      const updates = { done: true };
      if (priceVal)                      { updates.price = priceVal; pricesRef.child(priceKey(item.name)).set(priceVal); }
      if (qtyVal  && qtyVal  !== item.qty)  updates.qty  = qtyVal;
      if (unitVal && unitVal !== item.unit) updates.unit = unitVal;
      dbRef.child(String(pendingDoneId)).update(updates);

      historyRef.child(String(pendingDoneId)).set({
        itemId: item.id, name: item.name, category: item.category,
        qty:   qtyVal  || item.qty,
        unit:  unitVal || item.unit || 'шт.',
        price: priceVal || null,
        addedBy: item.addedBy, completedAt: Date.now(),
      });
    }
  }
  pendingDoneId = null;
}

function markItemDone(id, price) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  const effectivePrice = price !== undefined ? price : (item.price || null);
  dbRef.child(String(id)).update({ done: true });
  historyRef.child(String(id)).set({
    itemId: id, name: item.name, category: item.category,
    qty: item.qty, unit: item.unit || 'шт.',
    price: effectivePrice,
    addedBy: item.addedBy, completedAt: Date.now(),
  });
}

function deleteItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  if (!canManage(item)) { alert('Вы можете удалять только свои продукты'); return; }
  dbRef.child(String(id)).remove();
  if (item.done) historyRef.child(String(id)).remove();
}

function clearDone() {
  if (!items.some(i => i.done)) return;
  if (!confirm('Удалить купленные из списка?\n(История покупок сохранится)')) return;
  const updates = {};
  items.filter(i => i.done).forEach(i => { updates[String(i.id)] = null; });
  dbRef.update(updates);
  // История НЕ очищается
}

function clearAll() {
  if (!items.length) return;
  if (!confirm('Очистить весь список?\n(История покупок сохранится)')) return;
  dbRef.set(null);
  // История НЕ очищается
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
    name, category: document.getElementById('edit-category').value,
    qty:  parseInt(document.getElementById('edit-qty').value) || 1,
    unit: document.getElementById('edit-unit').value,
    price: priceVal,
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
function onDragOver(e)  { e.preventDefault(); this.classList.add('drag-over'); }
function onDragLeave()  { this.classList.remove('drag-over'); }
function onDrop(e) {
  e.stopPropagation(); this.classList.remove('drag-over');
  const ti = items.findIndex(i => i.id === parseInt(this.dataset.id));
  const si = items.findIndex(i => i.id === dragSrcId);
  if (si === -1 || ti === -1 || si === ti) return;
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
        const author   = USERS.find(u => u.id === item.addedBy);
        const cm       = canManage(item);
        const priceStr = item.price
          ? `<span class="item-price">${(item.price * item.qty).toLocaleString('ru')} ₸</span>` : '';
        const glassStr = item.glass ? `<span class="item-glass" title="Стекло">🍶</span>` : '';
        return `
          <div class="item ${item.done ? 'done' : ''}" data-id="${item.id}" draggable="true">
            <div class="drag-handle">⠿</div>
            <div class="item-check" onclick="toggleItem(${item.id})"></div>
            <div class="item-info">
              <div class="item-name">${esc(item.name)}</div>
              <div class="item-meta">
                <span class="item-qty">${item.qty} ${item.unit || 'шт.'}</span>
                ${priceStr}
                ${glassStr}
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
function openStats()  { renderStats(); document.getElementById('stats-modal').classList.remove('hidden'); }
function closeStats() { document.getElementById('stats-modal').classList.add('hidden'); }

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
  if      (statsPeriod === 'today') { fromTs = new Date().setHours(0,0,0,0); }
  else if (statsPeriod === 'week')  { fromTs = now - 7   * 864e5; }
  else if (statsPeriod === 'month') { fromTs = now - 30  * 864e5; }
  else if (statsPeriod === 'year')  { fromTs = now - 365 * 864e5; }
  else {
    const df = document.getElementById('date-from').value;
    const dt = document.getElementById('date-to').value;
    if (!df || !dt) return;
    fromTs = new Date(df).getTime();
    toTs   = new Date(dt).getTime() + 864e5 - 1;
  }

  let entries = Object.values(historyData).filter(h =>
    h.completedAt >= fromTs && h.completedAt <= toTs
  );
  if (!canSeeAll()) entries = entries.filter(h => h.addedBy === currentUserId);

  const el = document.getElementById('stats-content');
  if (!entries.length) {
    el.innerHTML = `<div class="stats-empty">Нет данных за выбранный период</div>`;
    return;
  }

  const totalCount = entries.length;
  const totalSpend = entries.reduce((s, h) => s + (h.price ? h.price * h.qty : 0), 0);
  const fmt = n => n > 0 ? `${n.toLocaleString('ru')} ₸` : '—';

  // По пользователям
  const byUser = {};
  entries.forEach(h => {
    const k = h.addedBy;
    if (!byUser[k]) byUser[k] = { count: 0, spend: 0 };
    byUser[k].count++;
    byUser[k].spend += h.price ? h.price * h.qty : 0;
  });

  // По категориям
  const byCat = {};
  entries.forEach(h => {
    if (!byCat[h.category]) byCat[h.category] = { count: 0, spend: 0 };
    byCat[h.category].count++;
    byCat[h.category].spend += h.price ? h.price * h.qty : 0;
  });

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
    </div>`;

  // Заказчики — первым разделом
  if (canSeeAll() && Object.keys(byUser).length > 0) {
    const usersSpend = Object.entries(byUser).reduce((s, [, d]) => s + d.spend, 0);
    html += `<div class="stats-section-title">По заказчикам</div>
    <div class="stats-table">
      ${Object.entries(byUser).map(([uid, d]) => {
        const u = USERS.find(u => u.id === parseInt(uid));
        return u ? `<div class="stats-row">
          <span class="stats-cat">${u.emoji} ${esc(u.name)}</span>
          <span class="stats-count">${d.count} поз.</span>
          <span class="stats-spend">${fmt(d.spend)}</span>
        </div>` : '';
      }).join('')}
      <div class="stats-row stats-row-total">
        <span class="stats-cat">📊 По всем</span>
        <span class="stats-count">${totalCount} поз.</span>
        <span class="stats-spend">${fmt(usersSpend)}</span>
      </div>
    </div>`;
  }

  html += `<div class="stats-section-title">По категориям</div>
    <div class="stats-table">
      ${Object.entries(byCat).map(([cat, d]) => `
        <div class="stats-row">
          <span class="stats-cat">${cat}</span>
          <span class="stats-count">${d.count} поз.</span>
          <span class="stats-spend">${fmt(d.spend)}</span>
        </div>`).join('')}
    </div>`;

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
document.getElementById('price-prompt-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') confirmPrice();
  if (e.key === 'Escape') skipPrice();
});
document.getElementById('price-prompt-qty').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('price-prompt-input').focus();
  if (e.key === 'Escape') skipPrice();
});
document.getElementById('edit-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('edit-modal')) closeEdit();
});
document.getElementById('stats-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('stats-modal')) closeStats();
});
document.getElementById('price-prompt').addEventListener('click', e => {
  if (e.target === document.getElementById('price-prompt')) skipPrice();
});

// ── Старт ──────────────────────────────────────────────────────────────────
init();

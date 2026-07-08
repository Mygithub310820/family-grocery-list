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
  '🥬 ОВОЩИ И ФРУТКИ', '🥩 Мясо и рыба', '🥛 Молочное',
  '🍞 Хлеб и выпечка', '🧴 Бытовая химия', '🥫 Бакалея',
  '🍬 Сладости', '🧃 Напитки', '❓ Другое',
];
const UNITS = ['шт.', 'кг', 'г', 'л', 'мл', 'упак.', 'пач.'];

// '---' — разделитель (пунктирная линия)
const POPULAR = {
  '🥬 ОВОЩИ И ФРУТКИ': ['Апельсины','Бананы','Баклажаны','Капуста','Картофель','Лук','Морковь','Огули','Перец болгарский','Помидоры','Свекла','Чеснок','Яблоки'],
  '🥩 Мясо и рыба':    ['Баранина','Говядина','Жая','К. бедра','К. грудка','К. ножки','Қазы','Қарта','Колбаса','Креветки','Лосось','Субпродукты','Фарш'],
  '🥛 Молочное':       ['🇬🇷 Йогурт','Масло сливочное','Сливки','Сметана','Соевый сомоком','Сомоком','Творог','Яйца','---','Burrata','Cheese Sveza','Halloumi','Stracciatella','Svalya'],
  '🍞 Хлеб и выпечка': ['Багет','Батон','Булочки','Круассаны','Лаваш','Пита','Слойки','Тосты','Хеб белый','Хеб чёрный','Хлебцы'],
  '🧴 Бытовая химия':  ['Гель для душа','Губки для посуды','Зубная паста','Кондиционер для белья','Мыло','Освежитель воздуха','Порошок стиральный','Салфетки','Средство для посуды','Туалетная бумага','Шампунь'],
  '🥫 Бакалея':        ['Булгур','Бурый Ись','Геркулес','Гречка','Ись','Киноа','Макароны','Масло авокадо','Масло оливковое','Масло подсолнечное','Мука','Перловка','Соль','Сахар','Чечевица красная','Чечевица коричневая'],
  '🍬 Сладости':       ['Вафли','Зефир','Карамель','Конфеты','Мармелад','Пастила','Печенье','Пряники','Торт','Халва','Шоколад'],
  '🧃 Напитки':        ['Боржоми','Вода без газиков','Вода с газиками','Какао','Квас','Кофе','Компот','Лимонад','Сарыағаш','Сок','Чай'],
  '❓ Другое':         [],
};

// Гликемический индекс (только для углеводных продуктов; для диапазонов — среднее значение)
const GI = {
  'Апельсины': 40, 'Бананы': 51, 'Баклажаны': 15, 'Капуста': 10, 'Картофель': 78,
  'Лук': 10, 'Морковь': 35, 'Огули': 15, 'Перец болгарский': 15, 'Помидоры': 15,
  'Свекла': 64, 'Яблоки': 36,
  '🇬🇷 Йогурт': 12, 'Соевый сомоком': 34, 'Сомоком': 31,
  'Багет': 95, 'Батон': 70, 'Булочки': 70, 'Круассаны': 67, 'Лаваш': 70,
  'Пита': 57, 'Слойки': 59, 'Тосты': 70, 'Хеб белый': 75, 'Хеб чёрный': 50, 'Хлебцы': 65,
  'Булгур': 48, 'Бурый Ись': 50, 'Геркулес': 55, 'Гречка': 50, 'Ись': 73,
  'Киноа': 53, 'Макароны': 50, 'Мука': 70, 'Перловка': 25, 'Сахар': 65,
  'Чечевица красная': 21, 'Чечевица коричневая': 30,
  'Вафли': 76, 'Зефир': 65, 'Карамель': 65, 'Конфеты': 65, 'Мармелад': 70,
  'Пастила': 65, 'Печенье': 55, 'Пряники': 65, 'Торт': 67, 'Халва': 35, 'Шоколад': 40,
  'Какао': 40, 'Квас': 45, 'Компот': 50, 'Лимонад': 63, 'Сок': 40,
};

// Гликемическая нагрузка на 100 г = ГИ × (доступные углеводы на 100 г) / 100
const GL = {
  'Апельсины': 4, 'Бананы': 10, 'Баклажаны': 0, 'Капуста': 0, 'Картофель': 12,
  'Лук': 1, 'Морковь': 2, 'Огули': 0, 'Перец болгарский': 1, 'Помидоры': 0,
  'Свекла': 5, 'Яблоки': 4,
  '🇬🇷 Йогурт': 0, 'Соевый сомоком': 1, 'Сомоком': 1,
  'Багет': 48, 'Батон': 34, 'Булочки': 35, 'Круассаны': 30, 'Лаваш': 34,
  'Пита': 31, 'Слойки': 27, 'Тосты': 34, 'Хеб белый': 37, 'Хеб чёрный': 21, 'Хлебцы': 39,
  'Булгур': 7, 'Бурый Ись': 11, 'Геркулес': 6, 'Гречка': 9, 'Ись': 20,
  'Киноа': 10, 'Макароны': 14, 'Мука': 51, 'Перловка': 5, 'Сахар': 65,
  'Чечевица красная': 3, 'Чечевица коричневая': 4,
  'Вафли': 52, 'Зефир': 51, 'Карамель': 57, 'Конфеты': 49, 'Мармелад': 55,
  'Пастила': 52, 'Печенье': 37, 'Пряники': 42, 'Торт': 34, 'Халва': 16, 'Шоколад': 22,
  'Какао': 4, 'Квас': 2, 'Компот': 6, 'Лимонад': 7, 'Сок': 4,
};

// ── Нормализация старых названий категорий ─────────────────────────────────
const CAT_ALIASES = {
  '🥬 Овощи и фрукты':  '🥬 ОВОЩИ И ФРУТКИ',
  '🥬 jОВОЩИ И ФРУТКИ': '🥬 ОВОЩИ И ФРУТКИ',
};
function normCat(cat) { return CAT_ALIASES[cat] || cat; }

// ── CSS-классы категорий ───────────────────────────────────────────────────
const CAT_CLASSES = {
  '🥬 ОВОЩИ И ФРУТКИ': 'cat-green',
  '🥩 Мясо и рыба':    'cat-red',
  '🥛 Молочное':       'cat-blue',
  '🍞 Хлеб и выпечка': 'cat-amber',
  '🧴 Бытовая химия':  'cat-purple',
  '🥫 Бакалея':        'cat-brown',
  '🍬 Сладости':       'cat-pink',
  '🧃 Напитки':        'cat-cyan',
  '❓ Другое':         'cat-grey',
};

// ── Состояние ──────────────────────────────────────────────────────────────
let items         = [];
let historyData   = {};
let prices        = {};
let itemHistory   = JSON.parse(localStorage.getItem('grocery-history') || '[]');
let currentUserId = JSON.parse(localStorage.getItem('grocery-session') || 'null');
let darkMode      = localStorage.getItem('grocery-dark') === 'true';
let currentFilter = 'active';
let editingId     = null;
let dragSrcId     = null;
let selectedUserId = null;
let statsPeriod   = 'today';
let pendingDoneId = null;   // id товара ожидающего подтверждения цены

let dbRef, historyRef, pricesRef;

// ── Firebase ───────────────────────────────────────────────────────────────
function initFirebase() {
  firebase.initializeApp(FIREBASE_CONFIG);
  firebase.auth().signInAnonymously().then(() => {
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
  }).catch(err => {
    console.error('Firebase auth failed:', err);
    alert('Не удалось подключиться к серверу. Проверьте интернет-соединение.');
  });
}

function priceKey(name) {
  return name.trim().toLowerCase().replace(/[^a-zа-яё0-9]/gi, '_');
}

// Позволяет вводить "2+3" (или "2+3=") в полях количества/цены — складывает несколько партий одного товара
function smartParseFloat(str) {
  str = String(str || '').trim();
  if (str.endsWith('=')) str = str.slice(0, -1).trim();
  if (str.includes('+')) {
    const parts = str.split('+').map(p => p.trim().replace(',', '.'));
    const valid = parts.length > 0 && parts.every(p => /^-?\d+(\.\d+)?$/.test(p));
    if (!valid) return NaN;
    const sum = parts.reduce((s, p) => s + parseFloat(p), 0);
    return Math.round(sum * 1000) / 1000;
  }
  return parseFloat(str.replace(',', '.'));
}

// Сразу показывает результат сложения в поле, когда пользователь нажимает "="
function attachSumInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const convert = () => {
    const sum = smartParseFloat(el.value);
    if (!isNaN(sum) && String(el.value).includes('+')) el.value = sum;
  };
  el.addEventListener('keydown', e => {
    if (e.key === '=') { e.preventDefault(); convert(); }
  });
  el.addEventListener('blur', convert);
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
}

// ── Тёмная тема ────────────────────────────────────────────────────────────
function toggleDark() {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);
  localStorage.setItem('grocery-dark', String(darkMode));
  document.querySelector('.dark-toggle').textContent = darkMode ? '☀️' : '🌙';
}

// ── Популярные товары (кнопки-чипы) ───────────────────────────────────────
function idxClass(val, lowMax, medMax) {
  if (val <= lowMax) return 'idx-low';
  if (val <= medMax) return 'idx-medium';
  return 'idx-high';
}

function updatePopular() {
  const cat     = document.getElementById('category-select').value;
  const popular = POPULAR[cat] || [];
  const container = document.getElementById('popular-items');

  let afterSeparator = false;
  container.innerHTML = popular.map(p => {
    if (p === '---') { afterSeparator = true; return '<div class="popular-separator"></div>'; }
    const cls  = afterSeparator ? 'popular-btn cheese-btn' : 'popular-btn';
    const gi   = GI[p];
    const gl   = GL[p];
    let label  = esc(p);
    if (gi !== undefined && gl !== undefined) {
      const giCls = idxClass(gi, 55, 69);
      const glCls = idxClass(gl, 10, 19);
      label += `(<span class="${giCls}">${gi}</span>/<span class="${glCls}">${gl}</span>)`;
    }
    return `<button class="${cls}" data-name="${esc(p)}" onclick="pickPopularBtn(this)">${label}</button>`;
  }).join('')
  + `<button class="popular-btn manual-btn" onclick="pickManual()">✏️ Вручную</button>`;

  // Показываем/скрываем чекбокс Стекло
  const isNapitki = cat === '🧃 Напитки';
  document.getElementById('glass-option').classList.toggle('hidden', !isNapitki);
  if (!isNapitki) document.getElementById('glass-check').checked = false;

  // Сброс
  document.getElementById('item-input').value  = '';
  document.getElementById('manual-wrap').classList.add('hidden');
  hideAutocomplete();
}

function pickPopularBtn(btn) {
  const wasSelected = btn.classList.contains('selected');
  document.querySelectorAll('.popular-btn').forEach(b => b.classList.remove('selected'));
  if (wasSelected) {
    document.getElementById('item-input').value = '';
    return;
  }
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
  setTimeout(() => document.getElementById('item-input').focus(), 50);
}

function fillPrice(name) {
  // price-input removed from add form; prices still tracked via purchase confirmation
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
  const glass    = document.getElementById('glass-check')?.checked || false;
  const id       = Date.now();

  dbRef.child(String(id)).set({
    id, name: finalName, category, qty, unit,
    price: null, glass: glass || false,
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
  const priceVal = smartParseFloat(document.getElementById('price-prompt-input').value) || null;
  const qtyVal   = smartParseFloat(document.getElementById('price-prompt-qty').value)   || null;
  const unitVal  = document.getElementById('price-prompt-unit').value;
  document.getElementById('price-prompt').classList.add('hidden');

  if (pendingDoneId !== null) {
    const item = items.find(i => i.id === pendingDoneId);
    if (item) {
      const actualQty = qtyVal || item.qty;
      // priceVal — итоговая стоимость за все; вычисляем цену за единицу
      const unitPrice = (priceVal && actualQty) ? +(priceVal / actualQty).toFixed(2) : null;
      const updates = { done: true };
      if (unitPrice)                          { updates.price = unitPrice; pricesRef.child(priceKey(item.name)).set(unitPrice); }
      if (qtyVal  && qtyVal  !== item.qty)      updates.qty  = qtyVal;
      if (unitVal && unitVal !== item.unit)      updates.unit = unitVal;
      dbRef.child(String(pendingDoneId)).update(updates);

      historyRef.child(String(pendingDoneId)).set({
        itemId: item.id, name: item.name, category: item.category,
        qty:   actualQty,
        unit:  unitVal || item.unit || 'шт.',
        price: unitPrice || null,
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
  const priceVal = smartParseFloat(document.getElementById('edit-price').value) || null;
  if (priceVal) pricesRef.child(priceKey(name)).set(priceVal);
  dbRef.child(String(editingId)).update({
    name, category: document.getElementById('edit-category').value,
    qty:  Math.round(smartParseFloat(document.getElementById('edit-qty').value)) || 1,
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
      active: { icon: '✅', text: 'Все продукты куплены!' },
      done:   { icon: '📋', text: 'Ещё ничего не куплено' },
    };
    const m = msgs[currentFilter];
    container.innerHTML = `<div class="empty-state"><div class="icon">${m.icon}</div><p>${m.text}</p></div>`;
    return;
  }

  if (currentFilter === 'active') {
    container.innerHTML = renderCategoryGroups(filtered);
  } else {
    const dayGroups = {};
    filtered.forEach(item => {
      const ts  = item.done ? (historyData[item.id] && historyData[item.id].completedAt) : null;
      const key = ts ? dayKey(ts) : 'nodate';
      if (!dayGroups[key]) dayGroups[key] = { ts, items: [] };
      dayGroups[key].items.push(item);
    });
    const sortedKeys = Object.keys(dayGroups).sort((a, b) => {
      if (a === 'nodate') return -1;
      if (b === 'nodate') return 1;
      return dayGroups[b].ts - dayGroups[a].ts;
    });
    container.innerHTML = sortedKeys.map(key => {
      const grp   = dayGroups[key];
      const label = key === 'nodate' ? 'Ещё не куплено' : dayLabel(grp.ts);
      return `
        <div class="day-group">
          <div class="day-header">${label}</div>
          ${renderCategoryGroups(grp.items)}
        </div>`;
    }).join('');
  }

  setupDragDrop();
}

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayLabel(ts) {
  const d       = new Date(ts);
  const today   = new Date();
  const startOf = date => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(d)) / 86400000);
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  const opts = { day: 'numeric', month: 'long' };
  if (d.getFullYear() !== today.getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('ru', opts);
}

function renderCategoryGroups(itemList) {
  const groups = {};
  itemList.forEach(item => {
    const cat = normCat(item.category);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  });

  return Object.entries(groups).map(([cat, catItems]) => {
    const m       = cat.match(/^(\S+)\s(.+)$/);
    const emoji   = m ? m[1] : '📦';
    const catName = m ? m[2] : cat;
    const cls     = CAT_CLASSES[cat] || 'cat-grey';
    return `
    <div class="category-group">
      <div class="category-header ${cls}">
        <span class="cat-emoji">${emoji}</span>
        <span class="cat-name">${catName}</span>
      </div>
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
  `;}).join('');
}

// ── Статистика ─────────────────────────────────────────────────────────────
function openStats()  { renderStats(); document.getElementById('stats-modal').classList.remove('hidden'); }
function closeStats() { document.getElementById('stats-modal').classList.add('hidden'); }

function openReference()  { document.getElementById('reference-modal').classList.remove('hidden'); }
function closeReference() { document.getElementById('reference-modal').classList.add('hidden'); }

function setStatsPeriod(period, btn) {
  statsPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('custom-period').classList.toggle('hidden', period !== 'custom');
  if (period !== 'custom') renderStats();
}

// Цвета для диаграмм
const PIE_COLORS = [
  '#6C5CE7','#00CEC9','#FDCB6E','#E17055','#74B9FF',
  '#A29BFE','#55EFC4','#FD79A8','#00B894','#D63031','#F9CA24',
];

function buildPie(slices, useSpend) {
  const total = slices.reduce((s, d) => s + (useSpend ? d.spend : d.count), 0);
  if (!total) return '';
  const size = 160, cx = 80, cy = 80, r = 70, hole = 42;
  let angle = -Math.PI / 2;
  const paths = slices.map((d, i) => {
    const val   = useSpend ? d.spend : d.count;
    const sweep = (val / total) * 2 * Math.PI;
    // Внешняя дуга
    const x1o = cx + r    * Math.cos(angle),    y1o = cy + r    * Math.sin(angle);
    const x1i = cx + hole * Math.cos(angle),    y1i = cy + hole * Math.sin(angle);
    angle += sweep;
    const x2o = cx + r    * Math.cos(angle),    y2o = cy + r    * Math.sin(angle);
    const x2i = cx + hole * Math.cos(angle),    y2i = cy + hole * Math.sin(angle);
    const lg  = sweep > Math.PI ? 1 : 0;
    d._color  = PIE_COLORS[i % PIE_COLORS.length];
    // Бублик-сегмент: внешняя дуга → внутренняя дуга в обратную сторону
    return `<path d="M${x1i.toFixed(1)},${y1i.toFixed(1)} L${x1o.toFixed(1)},${y1o.toFixed(1)} A${r},${r} 0 ${lg},1 ${x2o.toFixed(1)},${y2o.toFixed(1)} L${x2i.toFixed(1)},${y2i.toFixed(1)} A${hole},${hole} 0 ${lg},0 ${x1i.toFixed(1)},${y1i.toFixed(1)} Z" fill="${d._color}" stroke="var(--card)" stroke-width="2"/>`;
  }).join('');
  const legend = slices.map(d => {
    const val = useSpend ? d.spend : d.count;
    const pct = Math.round(val / total * 100);
    return `<div class="pie-legend-item">
      <span class="pie-dot" style="background:${d._color}"></span>
      <span class="pie-legend-label">${esc(d.label)}</span>
      <span class="pie-legend-pct">${pct}%</span>
    </div>`;
  }).join('');
  return `<div class="stats-pie-wrap">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="filter:drop-shadow(0 4px 10px rgba(0,0,0,0.18))">${paths}</svg>
    <div class="pie-legend">${legend}</div>
  </div>`;
}

function toggleStatsSection(header) {
  const body  = header.nextElementSibling;
  const arrow = header.querySelector('.s-arrow');
  const open  = !body.classList.contains('s-collapsed');
  body.classList.toggle('s-collapsed', open);
  arrow.textContent = open ? '▶' : '▼';
}

function toggleStatRow(row) {
  const detail = row.nextElementSibling;
  if (!detail || !detail.classList.contains('stats-row-detail')) return;
  const arrow  = row.querySelector('.s-row-arrow');
  const open   = !detail.classList.contains('hidden');
  detail.classList.toggle('hidden', open);
  if (arrow) arrow.textContent = open ? '▶' : '▼';
}

function collapsibleSection(title, innerHtml) {
  return `
    <div class="s-header" onclick="toggleStatsSection(this)">
      <span>${title}</span><span class="s-arrow">▶</span>
    </div>
    <div class="s-body s-collapsed">${innerHtml}</div>`;
}

function expandableRow(labelHtml, count, spendStr, detailHtml) {
  return `
    <div class="stats-row stats-expandable" onclick="toggleStatRow(this)">
      <span class="stats-cat">${labelHtml}</span>
      <span class="stats-count">${count} поз.</span>
      <span class="stats-spend">${spendStr}</span>
      <span class="s-row-arrow">▶</span>
    </div>
    <div class="stats-row-detail hidden">${detailHtml}</div>`;
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
  const fmt      = n => n > 0 ? `${n.toLocaleString('ru')} ₸` : '—';
  const useSpend = totalSpend > 0;

  // По заказчикам
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
    const cat = normCat(h.category);
    if (!byCat[cat]) byCat[cat] = { count: 0, spend: 0 };
    byCat[cat].count++;
    byCat[cat].spend += h.price ? h.price * h.qty : 0;
  });

  let html = `
    <div class="stats-summary">
      <div class="stats-card">
        <div class="stats-value">${totalCount}</div>
        <div class="stats-label">позиций куплено</div>
      </div>
      ${useSpend ? `<div class="stats-card accent">
        <div class="stats-value">${fmt(totalSpend)}</div>
        <div class="stats-label">потрачено</div>
      </div>` : ''}
    </div>`;

  // Секция "По заказчикам"
  if (canSeeAll() && Object.keys(byUser).length > 0) {
    const usersSpend = Object.entries(byUser).reduce((s, [, d]) => s + d.spend, 0);
    const userSlices = Object.entries(byUser).map(([uid, d]) => {
      const u = USERS.find(u => u.id === parseInt(uid));
      return u ? { label: `${u.emoji} ${u.name}`, count: d.count, spend: d.spend } : null;
    }).filter(Boolean);

    const userRows = Object.entries(byUser).map(([uid, d]) => {
      const u = USERS.find(u => u.id === parseInt(uid));
      if (!u) return '';
      const userEntries = entries.filter(h => h.addedBy === parseInt(uid));
      const detailHtml  = `<div class="stats-detail-table">${
        userEntries.map(h => `<div class="stats-detail-row">
          <span class="sd-name">${esc(h.name)}</span>
          <span class="sd-qty">${h.qty} ${h.unit || 'шт.'}</span>
          <span class="sd-price">${h.price ? fmt(h.price * h.qty) : '—'}</span>
        </div>`).join('')
      }</div>`;
      return expandableRow(`${u.emoji} ${esc(u.name)}`, d.count, fmt(d.spend), detailHtml);
    }).join('');

    const totalRow = `<div class="stats-row stats-row-total">
      <span class="stats-cat">📊 По всем</span>
      <span class="stats-count">${totalCount} поз.</span>
      <span class="stats-spend">${fmt(usersSpend)}</span>
      <span></span>
    </div>`;

    html += collapsibleSection('По заказчикам',
      buildPie(userSlices, useSpend) +
      `<div class="stats-table">${userRows}${totalRow}</div>`
    );
  }

  // Секция "По категориям"
  const catSlices = Object.entries(byCat).map(([cat, d]) => ({ label: cat, count: d.count, spend: d.spend }));
  const catRows   = Object.entries(byCat).map(([cat, d]) => {
    const catEntries = entries.filter(h => normCat(h.category) === cat);
    const detailHtml = `<div class="stats-detail-table">${
      catEntries.map(h => {
        const buyer = USERS.find(u => u.id === h.addedBy);
        return `<div class="stats-detail-row">
          <span class="sd-name">${esc(h.name)}</span>
          <span class="sd-qty">${buyer ? buyer.emoji : ''} ${h.qty} ${h.unit || 'шт.'}</span>
          <span class="sd-price">${h.price ? fmt(h.price * h.qty) : '—'}</span>
        </div>`;
      }).join('')
    }</div>`;
    return expandableRow(cat, d.count, fmt(d.spend), detailHtml);
  }).join('');

  html += collapsibleSection('По категориям',
    buildPie(catSlices, useSpend) +
    `<div class="stats-table">${catRows}</div>`
  );

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
['price-prompt-qty', 'price-prompt-input', 'edit-qty', 'edit-price'].forEach(attachSumInput);

// ── Старт ──────────────────────────────────────────────────────────────────
init();

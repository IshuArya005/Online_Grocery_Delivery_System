const sampleProducts = [
  {
    id: 1,
    name: 'Fresh Apples',
    group: 'fruits',
    category: 'veg',
    cuisine: 'Fruits',
    price: 160,
    badge: 'Best seller',
    desc: 'Crisp red apples, perfect for snacks and salads.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Organic Milk',
    group: 'dairy',
    category: 'non-veg',
    cuisine: 'Dairy',
    price: 120,
    badge: 'Fresh',
    desc: 'Creamy organic milk with rich flavor for daily use.',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Tomatoes',
    group: 'vegetables',
    category: 'veg',
    cuisine: 'Vegetables',
    price: 90,
    badge: 'Daily pick',
    desc: 'Juicy tomatoes for curries, salads, and sauces.',
    image: 'https://images.unsplash.com/photo-1615484478403-5327bceb3b3d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Brown Rice',
    group: 'pantry',
    category: 'veg',
    cuisine: 'Pantry',
    price: 220,
    badge: 'Healthy',
    desc: 'Nutty brown rice that cooks fluffy and delicious.',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Laundry Detergent',
    group: 'household',
    category: 'non-veg',
    cuisine: 'Household',
    price: 180,
    badge: 'Value pack',
    desc: 'Powerful detergent for fresh, clean laundry every day.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: 'Turmeric Powder',
    group: 'pantry',
    category: 'veg',
    cuisine: 'Spices',
    price: 140,
    badge: 'Spice',
    desc: 'Aromatic turmeric powder for curries and daily cooking.',
    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    name: 'Paneer Block',
    group: 'dairy',
    category: 'veg',
    cuisine: 'Dairy',
    price: 220,
    badge: 'Fresh',
    desc: 'Soft paneer block made from rich full-cream milk.',
    image: 'https://images.unsplash.com/photo-1611078481458-d42f7d2e5b55?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    name: 'Tea Powder',
    group: 'pantry',
    category: 'veg',
    cuisine: 'Beverages',
    price: 190,
    badge: 'Daily essential',
    desc: 'Premium tea blend for your morning and evening cups.',
    image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 9,
    name: 'Bread Loaf',
    group: 'pantry',
    category: 'veg',
    cuisine: 'Bakery',
    price: 80,
    badge: 'Everyday',
    desc: 'Soft whole wheat bread loaf perfect for breakfast and sandwiches.',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 10,
    name: 'Eggs (12pcs)',
    group: 'dairy',
    category: 'non-veg',
    cuisine: 'Dairy',
    price: 140,
    badge: 'Protein',
    desc: 'Fresh farm eggs for omelettes, baking, and everyday meals.',
    image: 'https://images.unsplash.com/photo-1510626176961-4b29b651b03e?auto=format&fit=crop&w=800&q=80'
  }
];

const items = [...sampleProducts];
const storageKey = 'craveCart';
const sessionKey = 'groceryHubSession';
let cart = JSON.parse(localStorage.getItem(storageKey) || '[]');
const state = { category: 'all', price: 'all', search: '' };
let activeItem = null;
let modalInstance = null;

function getSessionUser() {
  return JSON.parse(localStorage.getItem(sessionKey) || 'null');
}

function setSessionUser(user) {
  if (!user) return localStorage.removeItem(sessionKey);
  localStorage.setItem(sessionKey, JSON.stringify(user));
}

function clearSessionUser() {
  localStorage.removeItem(sessionKey);
}

function updateNavbarUser() {
  const user = getSessionUser();
  const userGreeting = document.getElementById('userGreeting');
  const userNavItem = document.getElementById('userNavItem');
  const logoutNavItem = document.getElementById('logoutNavItem');
  const loginNavItem = document.getElementById('loginNavItem');
  if (user && user.name) {
    if (userGreeting) userGreeting.textContent = `Hi, ${user.name}`;
    if (userNavItem) userNavItem.classList.remove('d-none');
    if (logoutNavItem) logoutNavItem.classList.remove('d-none');
    if (loginNavItem) loginNavItem.classList.add('d-none');
  } else {
    if (userNavItem) userNavItem.classList.add('d-none');
    if (logoutNavItem) logoutNavItem.classList.add('d-none');
    if (loginNavItem) loginNavItem.classList.remove('d-none');
  }
}

function sendOrderSms(phone) {
  if (!phone) return;
  const smsRecord = {
    phone,
    message: 'Your order is confirmed.',
    sentAt: new Date().toISOString()
  };
  localStorage.setItem('groceryHubLastSms', JSON.stringify(smsRecord));
}

async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Products API unavailable');
    const data = await response.json();
    if (!Array.isArray(data) || !data.length) throw new Error('No product data available');
    items.splice(0, items.length, ...data.map((entry) => ({ ...entry, id: entry._id || entry.id })));
    renderMenu();
  } catch (error) {
    console.warn('Products API unavailable, using fallback items.', error);
    items.splice(0, items.length, ...sampleProducts);
    renderMenu();
  }
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = cart.reduce((sum, entry) => sum + entry.qty, 0);
}

function addToCart(id) {
  const item = items.find(entry => String(entry.id) === String(id));
  if (!item) return;
  const existing = cart.find(entry => entry.id === Number(id));
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  saveCart();
  updateCartBadge();
  if (document.getElementById('cartItems')) renderCartPage();
}

function removeFromCart(id) {
  cart = cart.filter(entry => String(entry.id) !== String(id));
  saveCart();
  updateCartBadge();
  if (document.getElementById('cartItems')) renderCartPage();
}

function updateQty(id, delta) {
  const entry = cart.find(item => String(item.id) === String(id));
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateCartBadge();
  if (document.getElementById('cartItems')) renderCartPage();
}

function getFilteredItems() {
  return items.filter(item => {
    const matchesCategory = state.category === 'all' || item.group === state.category;
    const matchesPrice = (() => {
      if (state.price === 'under-200') return item.price < 200;
      if (state.price === '200-400') return item.price >= 200 && item.price <= 400;
      if (state.price === '400+') return item.price > 400;
      return true;
    })();
    const matchesSearch = item.name.toLowerCase().includes(state.search.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });
}

function renderMenu() {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;
  const filtered = getFilteredItems();
  menuGrid.innerHTML = filtered.length ? filtered.map(item => `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm overflow-hidden">
        <div class="menu-image" style="background-image: url('${item.image || 'https://via.placeholder.com/600x320?text=Grocery+Image'}');"></div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <span class="badge bg-warning text-dark">${item.badge}</span>
            <span class="fw-bold text-danger">₹${item.price}</span>
          </div>
          <h5 class="card-title mt-3">${item.name}</h5>
          <p class="text-muted small">${item.group.toUpperCase()} • ${item.category === 'veg' ? 'Fresh Produce' : 'Daily Essentials'}</p>
          <p class="card-text">${item.desc}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-danger btn-sm" data-action="details" data-id="${item.id}">Details</button>
            <button class="btn btn-danger btn-sm" data-action="add" data-id="${item.id}">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('') : '<div class="col-12"><div class="alert alert-info">No items match your filters.</div></div>';
}

function renderCartPage() {
  const cartItems = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const deliveryEl = document.getElementById('delivery');
  const totalEl = document.getElementById('total');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutSection = document.getElementById('checkoutSection');
  if (!cartItems || !subtotalEl || !deliveryEl || !totalEl) return;

  const subtotal = cart.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  const delivery = subtotal > 500 ? 0 : 60;
  const total = subtotal + delivery;

  if (!cart.length) {
    cartItems.innerHTML = '<div class="alert alert-secondary mb-0">Your cart is empty.</div>';
    subtotalEl.textContent = '₹0';
    deliveryEl.textContent = '₹0';
    totalEl.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (checkoutSection) checkoutSection.classList.add('d-none');
    return;
  }

  cartItems.innerHTML = cart.map(entry => `
    <div class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <div class="fw-bold">${entry.name}</div>
        <div class="text-muted small">₹${entry.price} each</div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-outline-secondary btn-sm" data-action="qty" data-id="${entry.id}" data-delta="-1">−</button>
        <span>${entry.qty}</span>
        <button class="btn btn-outline-secondary btn-sm" data-action="qty" data-id="${entry.id}" data-delta="1">+</button>
        <button class="btn btn-danger btn-sm" data-action="remove" data-id="${entry.id}">Remove</button>
      </div>
    </div>
  `).join('');

  subtotalEl.textContent = `₹${subtotal}`;
  deliveryEl.textContent = delivery === 0 ? 'Free' : `₹${delivery}`;
  totalEl.textContent = `₹${total}`;
  if (checkoutBtn) checkoutBtn.disabled = false;
  if (checkoutSection) checkoutSection.classList.add('d-none');
}

function showCheckoutForm() {
  const checkoutSection = document.getElementById('checkoutSection');
  if (checkoutSection) checkoutSection.classList.remove('d-none');
}

function completeOrderLocally(orderPayload, offline = false) {
  const orderRecord = {
    ...orderPayload,
    id: offline ? `OFF-${Date.now()}` : orderPayload.id,
    offline
  };
  localStorage.setItem('groceryHubLastOrder', JSON.stringify(orderRecord));
  if (orderRecord.userPhone) sendOrderSms(orderRecord.userPhone);
  localStorage.removeItem(storageKey);
  cart = [];
  saveCart();
  updateCartBadge();
  window.location.href = 'order.html';
}

async function submitOrder(event) {
  event.preventDefault();
  if (!cart.length) return;

  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value.trim() : '';
  const address = document.getElementById('customerAddress').value.trim();
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (!name || !email || !phone || !address) {
    alert('Please fill all delivery details.');
    return;
  }

  const subtotal = cart.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  const delivery = subtotal > 500 ? 0 : 60;
  const total = subtotal + delivery;

  const orderPayload = {
    userEmail: email,
    customerName: name,
    userPhone: phone,
    address,
    paymentMethod,
    items: cart.map(entry => ({ name: entry.name, price: entry.price, qty: entry.qty })),
    subtotal,
    delivery,
    total
  };

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const result = await response.json();
    if (response.ok) {
      completeOrderLocally({ ...orderPayload, id: result._id || `INV${Date.now()}` });
    } else {
      completeOrderLocally(orderPayload, true);
    }
  } catch (error) {
    completeOrderLocally(orderPayload, true);
  }
}

function openModal(id) {
  const modal = document.getElementById('itemModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalAddBtn = document.getElementById('modalAddBtn');
  if (!modal || !modalTitle || !modalBody || !modalAddBtn) return;
  activeItem = items.find(item => String(item.id) === String(id));
  if (!activeItem) return;
  modalTitle.textContent = activeItem.name;
  modalBody.innerHTML = `
    <p>${activeItem.desc}</p>
    <p><strong>Price:</strong> ₹${activeItem.price}</p>
    <p><strong>Category:</strong> ${activeItem.cuisine}</p>
    <p><strong>Type:</strong> ${activeItem.category === 'veg' ? 'Fresh Produce' : 'Daily Essentials'}</p>
  `;
  if (!modalInstance) modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
}

function bindMenuEvents() {
  const menuGrid = document.getElementById('menuGrid');
  if (menuGrid) {
    menuGrid.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const action = button.dataset.action;
      const id = button.dataset.id;
      if (action === 'add') addToCart(id);
      if (action === 'details') openModal(id);
    });
  }

  document.querySelectorAll('.btn-category').forEach(button => {
    button.addEventListener('click', () => {
      state.category = button.dataset.category;
      document.querySelectorAll('.btn-category').forEach(btn => btn.classList.toggle('active', btn === button));
      renderMenu();
    });
  });

  const priceFilter = document.getElementById('priceFilter');
  if (priceFilter) priceFilter.addEventListener('change', (event) => {
    state.price = event.target.value;
    renderMenu();
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    renderMenu();
  });
}

function applyHashCategory() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const validCategories = ['all', 'fruits', 'vegetables', 'dairy', 'pantry', 'household'];
  if (!hash || !validCategories.includes(hash)) return;
  state.category = hash;
  document.querySelectorAll('.btn-category').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === state.category);
  });
}

function bindCartEvents() {
  const cartItems = document.getElementById('cartItems');
  if (cartItems) {
    cartItems.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const action = button.dataset.action;
      const id = button.dataset.id;
      const delta = Number(button.dataset.delta || 0);
      if (action === 'remove') removeFromCart(id);
      if (action === 'qty') updateQty(id, delta);
    });
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.action === 'quick-add') addToCart(button.dataset.id);
  if (button.id === 'modalAddBtn') {
    if (activeItem) addToCart(activeItem.id);
    if (modalInstance) modalInstance.hide();
  }
  if (button.id === 'checkoutBtn') {
    showCheckoutForm();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  bindMenuEvents();
  bindCartEvents();
  applyHashCategory();
  renderMenu();
  renderCartPage();
  loadProducts();
  updateNavbarUser();
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) checkoutForm.addEventListener('submit', submitOrder);
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearSessionUser();
      updateNavbarUser();
      window.location.href = 'login.html';
    });
  }
});

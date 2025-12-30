// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);

  // Animate cards
  const cards = document.querySelectorAll(".card, .product-card");
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }
  });
});

// Helpers: LocalStorage keys
const USERS_KEY = 'soora_users';
const SESSION_KEY = 'soora_session';

// Init UI on load
document.addEventListener('DOMContentLoaded', () => {
  setupHeaderState();
  setupAuthForms();
  setupSearchPage();
  setupOptionsPersist();
});

// Header state: toggle login link vs user panel
function setupHeaderState() {
  const userPanel = document.getElementById('userPanel');
  const loginLink = document.getElementById('loginLink');
  const userNameSpan = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');

  const session = getSession();
  if (session) {
    if (loginLink) loginLink.style.display = 'none';
    if (userPanel) userPanel.style.display = 'flex';
    if (userNameSpan) userNameSpan.innerHTML = `<i class="fas fa-user-check"></i> ${session.name}`;
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (userPanel) userPanel.style.display = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(SESSION_KEY);
      // Redirect to home after logout
      window.location.href = 'index.html';
    });
  }
}

// Auth forms handlers
function setupAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;

      const msgEl = document.getElementById('registerMsg');

      if (!validateEmail(email)) {
        return showMsg(msgEl, 'Please enter a valid email.', true);
      }
      if (password.length < 6) {
        return showMsg(msgEl, 'Password must be at least 6 characters.', true);
      }

      const users = getUsers();
      if (users.find(u => u.email === email)) {
        return showMsg(msgEl, 'Email already registered. Try logging in.', true);
      }

      users.push({ name, email, password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      showMsg(msgEl, 'Account created successfully! Redirecting to login...', false);

      setTimeout(() => window.location.href = 'login.html', 1200);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const msgEl = document.getElementById('loginMsg');

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return showMsg(msgEl, 'Invalid email or password.', true);
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
      showMsg(msgEl, 'Welcome back! Redirecting...', false);

      setTimeout(() => window.location.href = 'index.html', 800);
    });
  }
}

// Search page logic
function setupSearchPage() {
  const resultsEl = document.getElementById('searchResults');
  const labelEl = document.getElementById('searchQueryLabel');

  // Only run on search.html
  if (!resultsEl || !labelEl) return;

  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || '').trim();
  labelEl.textContent = q ? `Showing results for: "${q}"` : 'No query provided.';

  // Demo products (you can replace with your real data)
  const products = [
    { title: 'Classic Look', price: 120, img: 'images/1.jpg' },
    { title: 'Urban Style', price: 95, img: 'images/2.jpg' },
    { title: 'Minimal Outfit', price: 110, img: 'images/3.jpg' },
    { title: 'Street Fashion', price: 130, img: 'images/4.jpg' },
  ];

  const filtered = q ? products.filter(p => p.title.toLowerCase().includes(q.toLowerCase())) : products;

  resultsEl.innerHTML = filtered.length
    ? filtered.map(p => `
      <div class="product-card">
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <span>$${p.price}</span>
      </div>
    `).join('')
    : `<p style="text-align:center;color:#ccc;">No results found.</p>`;
}

// Persist language/currency (optional)
function setupOptionsPersist() {
  const langSelect = document.getElementById('langSelect');
  const currencySelect = document.getElementById('currencySelect');

  if (langSelect) {
    const savedLang = localStorage.getItem('soora_lang');
    if (savedLang) langSelect.value = savedLang;
    langSelect.addEventListener('change', () => {
      localStorage.setItem('soora_lang', langSelect.value);
    });
  }
  if (currencySelect) {
    const savedCur = localStorage.getItem('soora_currency');
    if (savedCur) currencySelect.value = savedCur;
    currencySelect.addEventListener('change', () => {
      localStorage.setItem('soora_currency', currencySelect.value);
    });
  }
}

// Utils
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}
function showMsg(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? '#ff6b6b' : '#00f0ff';
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}












// productsss

document.addEventListener("DOMContentLoaded", function() {
  const modal = document.getElementById("cartModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const quantityInput = document.getElementById("quantity");
  const closeBtn = document.querySelector(".close-btn");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const cartCount = document.getElementById("cartCount");

  let cartTotal = 0;
  let cartItems = [];

  // فتح المودال عند الضغط على أيقونة السلة في المنتج
  document.querySelectorAll(".cart-icon").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      const name = card.getAttribute("data-name");
      const img = card.getAttribute("data-img");

      modalTitle.textContent = name;
      modalImg.src = img;
      quantityInput.value = 1;
      modal.style.display = "flex";
    });
  });

  // إغلاق المودال
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // إضافة للسلة
  addToCartBtn.addEventListener("click", () => {
    const qty = parseInt(quantityInput.value);
    const product = {
      name: modalTitle.textContent,
      img: modalImg.src,
      qty: qty
    };

    cartItems.push(product);
    cartTotal += qty;

    // تحديث العداد
    cartCount.textContent = cartTotal;
    cartCount.classList.add("bump");
    setTimeout(() => cartCount.classList.remove("bump"), 300);

    // حفظ في LocalStorage عشان يظهر في صفحة cart.html
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    modal.style.display = "none";
  });

  // إغلاق المودال لو ضغطنا خارج المحتوى
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll(".filter-buttons button");
  const productGrid = document.querySelector(".product-grid");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      const cards = Array.from(productGrid.querySelectorAll(".product-card"));
      let sortedCards = [];

      if (filter === "price-asc") {
        sortedCards = cards.sort((a, b) => getPrice(a) - getPrice(b));
      } else if (filter === "price-desc") {
        sortedCards = cards.sort((a, b) => getPrice(b) - getPrice(a));
      }

      productGrid.innerHTML = "";
      sortedCards.forEach(card => productGrid.appendChild(card));
    });
  });

  function getPrice(card) {
    const priceText = card.querySelector(".price").textContent;
    const clean = priceText.replace(/[^0-9.]/g, "");
    return parseFloat(clean);
  }
});







document.addEventListener("DOMContentLoaded", function() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // تسجيل الدخول
  loginBtn.addEventListener("click", function() {
    localStorage.setItem("loggedIn", "true"); // نخزن الحالة
    alert("✅ تم تسجيل الدخول");
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  });

  // تسجيل الخروج
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("loggedIn"); // نمسح الحالة
    alert("❌ تم تسجيل الخروج");
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
  });

  // التحقق عند تحميل الصفحة
  if (localStorage.getItem("loggedIn") === "true") {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  }
});


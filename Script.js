
// =====================================
// LUXE PREMIUM E-COMMERCE JAVASCRIPT
// =====================================

// MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("show");

  menuToggle.textContent = navigation.classList.contains("show")
    ? "✕"
    : "☰";
});

document.querySelectorAll(".navigation a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("show");
    menuToggle.textContent = "☰";
  });
});


// DARK AND LIGHT THEME

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("luxeTheme");

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "☾";
} else {
  document.body.classList.remove("light-theme");
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const isLight = document.body.classList.contains("light-theme");

  themeToggle.textContent = isLight ? "☾" : "☀";

  localStorage.setItem(
    "luxeTheme",
    isLight ? "light" : "dark"
  );
});


// PRODUCT FILTERING

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const productCount = document.getElementById("productCount");

let selectedCategory = "All";
let searchTerm = "";

function filterProducts() {
  let count = 0;

  productCards.forEach(card => {
    const category = card.dataset.category;
    const name = card.dataset.name.toLowerCase();

    const categoryMatch =
      selectedCategory === "All" ||
      category === selectedCategory;

    const searchMatch =
      name.includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm);

    const shouldShow = categoryMatch && searchMatch;

    card.hidden = !shouldShow;

    if (shouldShow) {
      count++;
    }
  });

  noResults.hidden = count !== 0;
  productCount.textContent = `${count} PRODUCTS`;
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    filterProducts();
  });
});


// COLLECTION CARD FILTER

document.querySelectorAll(".collection-card").forEach(card => {
  card.addEventListener("click", () => {
    selectedCategory = card.dataset.category;

    filterButtons.forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.filter === selectedCategory
      );
    });

    filterProducts();

    document.getElementById("shop").scrollIntoView({
      behavior: "smooth"
    });
  });
});


// PRODUCT SEARCH

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.toLowerCase().trim();
  filterProducts();
});


// SHOPPING CART

let cart = [];

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}

function hideCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
cartOverlay.addEventListener("click", hideCart);


// ADD PRODUCTS TO CART

productGrid.addEventListener("click", event => {
  const button = event.target.closest(".quick-add");

  if (!button) return;

  const card = button.closest(".product-card");

  const productName = card.dataset.name;
  const productPrice = Number(card.dataset.price);

  const existingProduct = cart.find(
    item => item.name === productName
  );

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      quantity: 1
    });
  }

  updateCart();

  const originalText = button.textContent;

  button.textContent = "ADDED ✓";

  setTimeout(() => {
    button.textContent = originalText;
  }, 1000);
});


// DISPLAY CART

function updateCart() {
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;

  cartTotal.textContent =
    "₹" + totalAmount.toLocaleString("en-IN");

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your shopping bag is empty.</p>';

    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>₹${item.price.toLocaleString("en-IN")}</p>
      </div>

      <div class="quantity-controls">
        <button data-index="${index}" data-change="-1"
          aria-label="Decrease quantity">−</button>

        <span>${item.quantity}</span>

        <button data-index="${index}" data-change="1"
          aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join("");
}


// CHANGE CART QUANTITY

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");

  if (!button) return;

  const index = Number(button.dataset.index);
  const change = Number(button.dataset.change);

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
});


// CHECKOUT DEMO

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your shopping bag is empty!");
    return;
  }

  alert(
    "Thank you for choosing ANJEL! This is a demonstration checkout. No payment has been taken."
  );

  cart = [];
  updateCart();
  hideCart();
});


// NEWSLETTER

const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

newsletterForm.addEventListener("submit", event => {
  event.preventDefault();

  newsletterMessage.textContent =
    "Thank you for joining the LUXE community!";

  newsletterForm.reset();
});

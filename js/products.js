// ===== Fetch API: Katalog Produk =====
const API_URL = "https://dummyjson.com/products";

// Elemen DOM
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMessageEl = document.getElementById("error-message");
const emptyEl = document.getElementById("empty");
const retryBtn = document.getElementById("retry-btn");
const reloadBtn = document.getElementById("reload-btn");
const productListEl = document.getElementById("product-list");
const resultInfoEl = document.getElementById("result-info");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");

// Menyimpan semua produk hasil fetch (dipakai untuk search & filter)
let allProducts = [];

// ---------- Fungsi bantu ----------
function formatPrice(price) {
  return "$" + Number(price).toFixed(2);
}

function formatCategory(category) {
  return category.replace(/-/g, " ");
}

// Harga asli = harga diskon / (1 - diskon%)
function getOriginalPrice(price, discount) {
  return price / (1 - discount / 100);
}

// ---------- Membuat kartu produk (DOM) ----------
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  // Badge diskon
  if (product.discountPercentage > 0) {
    const badge = document.createElement("span");
    badge.className = "badge-discount";
    badge.textContent = "-" + product.discountPercentage.toFixed(1) + "%";
    card.appendChild(badge);
  }

  // Gambar
  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image";
  const img = document.createElement("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";
  imageWrap.appendChild(img);

  // Info
  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = formatCategory(product.category);

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.title;
  name.title = product.title;

  // Rating
  const rating = document.createElement("div");
  rating.className = "rating";
  const stars = document.createElement("span");
  stars.className = "stars";
  stars.textContent = "★★★★★";
  stars.style.setProperty("--percent", (product.rating / 5) * 100 + "%");
  const ratingText = document.createElement("span");
  ratingText.textContent = product.rating.toFixed(2) + " / 5";
  rating.append(stars, ratingText);

  // Harga
  const priceRow = document.createElement("div");
  priceRow.className = "price-row";
  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(product.price);
  priceRow.appendChild(price);

  if (product.discountPercentage > 0) {
    const oldPrice = document.createElement("span");
    oldPrice.className = "price-old";
    oldPrice.textContent = formatPrice(
      getOriginalPrice(product.price, product.discountPercentage)
    );
    priceRow.appendChild(oldPrice);
  }

  info.append(category, name, rating, priceRow);
  card.append(imageWrap, info);
  return card;
}

// ---------- Menampilkan produk ----------
function renderProducts(products) {
  productListEl.innerHTML = "";

  if (products.length === 0) {
    emptyEl.classList.remove("hidden");
  } else {
    emptyEl.classList.add("hidden");
    products.forEach((product) => {
      productListEl.appendChild(createProductCard(product));
    });
  }

  resultInfoEl.textContent = "Menampilkan " + products.length + " produk";
}

// ---------- Isi pilihan kategori dari data ----------
function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  categorySelect.innerHTML = '<option value="">Semua Kategori</option>';

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = formatCategory(cat).replace(/\b\w/g, (c) => c.toUpperCase());
    categorySelect.appendChild(option);
  });
}

// ---------- Search + filter ----------
function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  const filtered = allProducts.filter((product) => {
    const matchName = product.title.toLowerCase().includes(keyword);
    const matchCategory = category === "" || product.category === category;
    return matchName && matchCategory;
  });

  renderProducts(filtered);
}

// ---------- Ambil data dari API ----------
async function loadProducts() {
  // Tampilkan loading, sembunyikan yang lain
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  emptyEl.classList.add("hidden");
  productListEl.innerHTML = "";
  resultInfoEl.textContent = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Server merespons dengan status " + response.status);
    }

    const data = await response.json();

    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error("Data produk kosong atau format tidak sesuai.");
    }

    allProducts = data.products;
    populateCategories(allProducts);
    searchInput.value = "";
    categorySelect.value = "";
    renderProducts(allProducts);
  } catch (error) {
    errorMessageEl.textContent = "Gagal memuat data produk: " + error.message;
    errorEl.classList.remove("hidden");
    console.error(error);
  } finally {
    loadingEl.classList.add("hidden");
  }
}

// ---------- Event listener ----------
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
reloadBtn.addEventListener("click", loadProducts);
retryBtn.addEventListener("click", loadProducts);

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadProducts);
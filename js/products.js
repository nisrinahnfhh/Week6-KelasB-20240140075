// ===== Fetch API: Data Produk =====
const API_URL = "https://dummyjson.com/products";

// Ambil elemen DOM
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMessageEl = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const productListEl = document.getElementById("product-list");

// Format harga ke dolar
function formatPrice(price) {
  return "$" + Number(price).toFixed(2);
}

// Buat satu kartu produk memakai DOM
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.category;

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.title;

  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  info.append(category, name, price);
  card.append(img, info);
  return card;
}

// Tampilkan semua produk ke halaman
function renderProducts(products) {
  productListEl.innerHTML = "";
  products.forEach((product) => {
    productListEl.appendChild(createProductCard(product));
  });
}

// Ambil data dari API
async function loadProducts() {
  // Reset tampilan: tampilkan loading
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  productListEl.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Server merespons dengan status " + response.status);
    }

    const data = await response.json();

    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error("Data produk kosong atau format tidak sesuai.");
    }

    renderProducts(data.products);
  } catch (error) {
    errorMessageEl.textContent = "Gagal memuat data produk: " + error.message;
    errorEl.classList.remove("hidden");
    console.error(error);
  } finally {
    loadingEl.classList.add("hidden");
  }
}

// Event: tombol coba lagi
retryBtn.addEventListener("click", loadProducts);

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadProducts);
// ===== Caption Generator: DOM & Event Handling =====

// ---------- Elemen DOM ----------
const form = document.getElementById("caption-form");
const namaInput = document.getElementById("nama");
const platformInput = document.getElementById("platform");
const toneInput = document.getElementById("tone");
const fiturInput = document.getElementById("fitur");
const promoInput = document.getElementById("promo");
const ctaInput = document.getElementById("cta");
const tagsInput = document.getElementById("tags");
const emojiInput = document.getElementById("emoji");
const autotagInput = document.getElementById("autotag");

const namaCount = document.getElementById("nama-count");
const fiturCount = document.getElementById("fitur-count");

const outputEl = document.getElementById("caption-output");
const badgeEl = document.getElementById("badge");
const statChars = document.getElementById("stat-chars");
const statWords = document.getElementById("stat-words");
const statTags = document.getElementById("stat-tags");
const warningEl = document.getElementById("stat-warning");

const copyBtn = document.getElementById("copy-btn");
const variantBtn = document.getElementById("variant-btn");
const resetBtn = document.getElementById("reset-btn");
const clearHistoryBtn = document.getElementById("clear-history");
const historyList = document.getElementById("history-list");

// ---------- Data & template ----------
const TONES = {
  profesional: {
    short: "Profesional",
    openers: [
      (n) => `Tingkatkan standar Anda bersama ${n}.`,
      (n) => `Hadir untuk Anda: ${n}.`,
      (n) => `Solusi terbaik melalui ${n}.`,
      (n) => `Kenali ${n}, pilihan yang terpercaya.`,
    ],
  },
  santai: {
    short: "Santai",
    openers: [
      (n) => `Hai kamu! Udah kenalan sama ${n} belum?`,
      (n) => `Lagi cari yang pas? ${n} jawabannya!`,
      (n) => `Yuk, kenalan sama ${n}!`,
      (n) => `Kabar baik buat kamu: ada ${n}!`,
    ],
  },
  persuasif: {
    short: "Persuasif",
    openers: [
      (n) => `Jangan sampai ketinggalan! ${n} sudah siap untuk Anda.`,
      (n) => `Saatnya upgrade bersama ${n}!`,
      (n) => `Kenapa harus ${n}? Karena kualitasnya tidak main-main.`,
      (n) => `Stok terbatas! Miliki ${n} sekarang juga.`,
    ],
  },
  lucu: {
    short: "Lucu",
    openers: [
      (n) => `Dompet bilang jangan, tapi ${n} bilang yuk!`,
      (n) => `Peringatan: ${n} bisa bikin kamu ketagihan.`,
      (n) => `${n} datang, galau pun hilang!`,
      (n) => `Katanya cinta itu buta, tapi ${n} bikin melek!`,
    ],
  },
};

const MAX_TAGS = {
  Instagram: 8,
  TikTok: 5,
  Facebook: 3,
  "X (Twitter)": 3,
  WhatsApp: 2,
};

const CHAR_LIMIT = {
  Instagram: 2200,
  TikTok: 2200,
  Facebook: 63206,
  "X (Twitter)": 280,
  WhatsApp: 4096,
};

let currentData = null; // data form terakhir yang dipakai membuat caption
let currentText = ""; // caption yang sedang tampil
let variantIndex = 0;
let history = [];

// ---------- Fungsi bantu ----------
function cleanTag(text) {
  return text.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function setError(input, message) {
  document.getElementById(input.id + "-error").textContent = message;
  input.classList.toggle("invalid", message !== "");
  return message === "";
}

// ---------- Validasi ----------
function validateNama() {
  const v = namaInput.value.trim();
  if (v === "") return setError(namaInput, "Nama produk / topik wajib diisi.");
  if (v.length < 3) return setError(namaInput, "Minimal 3 karakter.");
  return setError(namaInput, "");
}

function validatePlatform() {
  if (platformInput.value === "") return setError(platformInput, "Pilih platform.");
  return setError(platformInput, "");
}

function validateTone() {
  if (toneInput.value === "") return setError(toneInput, "Pilih gaya bahasa.");
  return setError(toneInput, "");
}

function validateFitur() {
  const v = fiturInput.value.trim();
  if (v === "") return setError(fiturInput, "Keunggulan wajib diisi.");
  if (v.length < 10) return setError(fiturInput, "Minimal 10 karakter.");
  return setError(fiturInput, "");
}

function validateTags() {
  const v = tagsInput.value.trim();
  if (v !== "" && !/^[A-Za-z0-9_\s,]+$/.test(v)) {
    return setError(tagsInput, "Hanya huruf, angka, dan koma. Tanpa tanda # atau simbol.");
  }
  return setError(tagsInput, "");
}

// ---------- Membuat caption ----------
function collectData() {
  return {
    nama: namaInput.value.trim(),
    platform: platformInput.value,
    tone: toneInput.value,
    fitur: fiturInput.value.trim(),
    promo: promoInput.value.trim(),
    cta: ctaInput.value.trim(),
    tags: tagsInput.value,
    emoji: emojiInput.checked,
    autotag: autotagInput.checked,
  };
}

function buildHashtags(data) {
  let tags = data.tags.split(",").map(cleanTag).filter(Boolean);

  if (data.autotag) {
    if (tags.length === 0) tags.push(cleanTag(data.nama));
    tags.push(cleanTag(data.platform));
    tags.push("rekomendasi");
  }

  tags = [...new Set(tags)].filter(Boolean);
  return tags.slice(0, MAX_TAGS[data.platform]).map((t) => "#" + t);
}

function generateCaption(data, variant) {
  const tone = TONES[data.tone];
  const opener = tone.openers[variant % tone.openers.length](data.nama);
  const e = (symbol) => (data.emoji ? symbol + " " : "");

  const lines = [opener, "", e("✅") + data.fitur];

  if (data.promo) lines.push(e("🔥") + "Promo Spesial: " + data.promo + "!");
  if (data.cta) lines.push(e("👉") + data.cta);

  const tags = buildHashtags(data);
  if (tags.length > 0) lines.push("", tags.join(" "));

  return lines.join("\n");
}

// ---------- Menampilkan hasil ----------
function showCaption(text, data) {
  currentText = text;
  outputEl.textContent = text;
  outputEl.classList.remove("placeholder");

  badgeEl.textContent = data.platform + " • " + TONES[data.tone].short;

  const chars = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const tagCount = (text.match(/#\w+/g) || []).length;

  statChars.textContent = chars;
  statWords.textContent = words;
  statTags.textContent = tagCount;

  const limit = CHAR_LIMIT[data.platform];
  if (chars > limit) {
    warningEl.textContent =
      "Caption melebihi batas " + limit + " karakter untuk " + data.platform + ".";
    warningEl.classList.remove("hidden");
  } else {
    warningEl.classList.add("hidden");
  }

  copyBtn.disabled = false;
  variantBtn.disabled = false;
}

// ---------- Riwayat ----------
function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const p = document.createElement("p");
    p.className = "history-empty";
    p.textContent = "Belum ada riwayat.";
    historyList.appendChild(p);
    return;
  }

  history.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "history-item";

    const meta = document.createElement("span");
    meta.className = "history-meta";
    meta.textContent = item.data.platform + " • " + item.time;

    const snippet = item.text.replace(/\s+/g, " ").slice(0, 70);
    const body = document.createElement("span");
    body.textContent = item.data.nama + ' — "' + snippet + '..."';

    btn.append(meta, body);

    // Klik riwayat untuk menampilkan kembali caption tersebut
    btn.addEventListener("click", () => {
      currentData = item.data;
      showCaption(item.text, item.data);
    });

    historyList.appendChild(btn);
  });
}

function addHistory(text, data) {
  const time = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  history.unshift({ text, data, time });
  history = history.slice(0, 10);
  renderHistory();
}

// ---------- Salin ke clipboard ----------
async function copyCaption() {
  try {
    await navigator.clipboard.writeText(currentText);
  } catch (err) {
    // Cadangan jika clipboard API tidak tersedia
    const temp = document.createElement("textarea");
    temp.value = currentText;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
  }

  copyBtn.textContent = "Tersalin!";
  setTimeout(() => {
    copyBtn.textContent = "Salin Caption";
  }, 1500);
}

// ---------- Event listener ----------

// Penghitung karakter + validasi real-time
namaInput.addEventListener("input", () => {
  namaCount.textContent = namaInput.value.length;
  if (namaInput.classList.contains("invalid")) validateNama();
});

fiturInput.addEventListener("input", () => {
  fiturCount.textContent = fiturInput.value.length;
  if (fiturInput.classList.contains("invalid")) validateFitur();
});

tagsInput.addEventListener("input", validateTags);
platformInput.addEventListener("change", validatePlatform);
toneInput.addEventListener("change", validateTone);

// Submit form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const valid = [
    validateNama(),
    validatePlatform(),
    validateTone(),
    validateFitur(),
    validateTags(),
  ].every(Boolean);

  if (!valid) return;

  currentData = collectData();
  variantIndex = 0;

  const text = generateCaption(currentData, variantIndex);
  showCaption(text, currentData);
  addHistory(text, currentData);
});

// Variasi lain
variantBtn.addEventListener("click", () => {
  if (!currentData) return;
  variantIndex++;
  const text = generateCaption(currentData, variantIndex);
  showCaption(text, currentData);
  addHistory(text, currentData);
});

// Salin
copyBtn.addEventListener("click", copyCaption);

// Hapus semua riwayat
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  renderHistory();
});

// Reset form
resetBtn.addEventListener("click", () => {
  form.reset();
  namaCount.textContent = "0";
  fiturCount.textContent = "0";

  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  form.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));

  currentData = null;
  currentText = "";
  variantIndex = 0;

  outputEl.textContent = 'Isi form di sebelah kiri lalu klik "Buat Caption".';
  outputEl.classList.add("placeholder");
  badgeEl.textContent = "Belum ada";
  statChars.textContent = "0";
  statWords.textContent = "0";
  statTags.textContent = "0";
  warningEl.classList.add("hidden");
  copyBtn.disabled = true;
  variantBtn.disabled = true;
});
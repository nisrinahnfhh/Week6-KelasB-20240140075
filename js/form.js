// ===== Form: DOM & Event Handling =====
const form = document.getElementById("register-form");
const namaInput = document.getElementById("nama");
const emailInput = document.getElementById("email");
const teleponInput = document.getElementById("telepon");
const workshopInput = document.getElementById("workshop");
const pesanInput = document.getElementById("pesan");
const setujuInput = document.getElementById("setuju");
const charCount = document.getElementById("char-count");
const resetBtn = document.getElementById("reset-btn");
const feedbackEl = document.getElementById("form-feedback");
const resultEl = document.getElementById("result");
const resultList = document.getElementById("result-list");

// ---------- Fungsi bantu tampilan error ----------
function setError(input, message) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = message;
  if (input.type !== "checkbox") {
    input.classList.add("invalid");
    input.classList.remove("valid");
  }
}

function setValid(input) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = "";
  if (input.type !== "checkbox") {
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

// ---------- Fungsi validasi (return true jika valid) ----------
function validateNama() {
  const value = namaInput.value.trim();
  if (value === "") {
    setError(namaInput, "Nama wajib diisi.");
    return false;
  }
  if (value.length < 3) {
    setError(namaInput, "Nama minimal 3 karakter.");
    return false;
  }
  if (!/^[A-Za-z\s.'-]+$/.test(value)) {
    setError(namaInput, "Nama hanya boleh berisi huruf.");
    return false;
  }
  setValid(namaInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value === "") {
    setError(emailInput, "Email wajib diisi.");
    return false;
  }
  if (!pattern.test(value)) {
    setError(emailInput, "Format email tidak valid.");
    return false;
  }
  setValid(emailInput);
  return true;
}

function validateTelepon() {
  const value = teleponInput.value.trim();
  const pattern = /^(08|\+628)\d{8,11}$/;
  if (value === "") {
    setError(teleponInput, "No. HP wajib diisi.");
    return false;
  }
  if (!pattern.test(value)) {
    setError(teleponInput, "Gunakan format 08xxxxxxxxxx atau +628xxxxxxxxxx.");
    return false;
  }
  setValid(teleponInput);
  return true;
}

function validateWorkshop() {
  if (workshopInput.value === "") {
    setError(workshopInput, "Pilih salah satu workshop.");
    return false;
  }
  setValid(workshopInput);
  return true;
}

function validatePesan() {
  const value = pesanInput.value.trim();
  if (value.length < 10) {
    setError(pesanInput, "Alasan minimal 10 karakter.");
    return false;
  }
  setValid(pesanInput);
  return true;
}

function validateSetuju() {
  if (!setujuInput.checked) {
    setError(setujuInput, "Kamu harus menyetujui pernyataan ini.");
    return false;
  }
  setValid(setujuInput);
  return true;
}

// ---------- Tampilkan umpan balik ----------
function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = "feedback " + type;
}

// ---------- Tampilkan hasil pemrosesan ----------
function showResult(data) {
  resultList.innerHTML = "";

  const rows = [
    ["Nama", data.nama],
    ["Email", data.email],
    ["No. HP", data.telepon],
    ["Workshop", data.workshop],
    ["Alasan", data.pesan],
  ];

  rows.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    resultList.append(dt, dd);
  });

  resultEl.classList.remove("hidden");
}

// ---------- Event listener ----------

// Validasi real-time saat pengguna mengetik / mengubah input
namaInput.addEventListener("input", validateNama);
emailInput.addEventListener("input", validateEmail);
teleponInput.addEventListener("input", validateTelepon);
workshopInput.addEventListener("change", validateWorkshop);
setujuInput.addEventListener("change", validateSetuju);

pesanInput.addEventListener("input", () => {
  charCount.textContent = pesanInput.value.length; // penghitung karakter dinamis
  validatePesan();
});

// Submit form
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Jalankan semua validasi (tidak berhenti di error pertama)
  const results = [
    validateNama(),
    validateEmail(),
    validateTelepon(),
    validateWorkshop(),
    validatePesan(),
    validateSetuju(),
  ];

  const allValid = results.every(Boolean);

  if (!allValid) {
    resultEl.classList.add("hidden");
    showFeedback("Pendaftaran gagal. Periksa kembali data yang belum valid.", "fail");
    return;
  }

  const data = {
    nama: namaInput.value.trim(),
    email: emailInput.value.trim(),
    telepon: teleponInput.value.trim(),
    workshop: workshopInput.value,
    pesan: pesanInput.value.trim(),
  };

  showFeedback("Terima kasih, " + data.nama + "! Pendaftaran berhasil dikirim.", "success");
  showResult(data);
});

// Tombol reset
resetBtn.addEventListener("click", () => {
  form.reset();
  charCount.textContent = "0";

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.classList.remove("valid", "invalid");
  });
  form.querySelectorAll(".error-text").forEach((el) => {
    el.textContent = "";
  });

  feedbackEl.className = "feedback hidden";
  resultEl.classList.add("hidden");
});
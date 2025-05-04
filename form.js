const STORAGE_KEY = "user-profile";

// Початковий стан
let formData = {
  name: "",
  email: "",
  age: "",
  gender: "",
  photo: "",
  bio: "",
  public: false,
  theme: "light"
};

// DOM елементи
const form = document.querySelector(".profile-form");
const resetBtn = document.getElementById("reset-profile");
const { theme } = form.elements;

// Завантаження збережених даних
loadProfile();

// Слухачі подій
form.addEventListener("input", handleInput);
form.addEventListener("submit", handleSubmit);
resetBtn.addEventListener("click", handleReset);

// Завантаження з localStorage
function loadProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    formData = JSON.parse(saved);

    for (const [key, value] of Object.entries(formData)) {
      const field = form.elements[key];
      if (!field) continue;

      if (field.type === "checkbox") {
        field.checked = value;
      } else if (field.type === "radio") {
        const radio = form.querySelector(
          `input[name="${key}"][value="${value}"]`
        );
        if (radio) radio.checked = true;
      } else {
        field.value = value;
      }
    }

    applyTheme(formData.theme);
  } catch (err) {
    console.error("❌ Error loading profile:", err);
  }
}

// Обробка введення
function handleInput(e) {
  const { name, type, value, checked } = e.target;

  if (!name) return;

  if (type === "checkbox") {
    formData[name] = checked;
  } else if (type === "radio") {
    formData[name] = value;
  } else {
    formData[name] = value;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

  if (name === "theme") applyTheme(value);
}

// Обробка надсилання форми
function handleSubmit(e) {
  e.preventDefault();

  const { name, email } = formData;

  if (name.trim() === "" || email.trim() === "") {
    alert("Будь ласка, заповніть Імʼя та Email.");
    return;
  }

  console.log("✅ Збережено профіль:", formData);
  alert("Профіль збережено!");
}

// Обробка кнопки "Reset"
function handleReset() {
  const confirmReset = confirm("Очистити всі дані профілю?");
  if (!confirmReset) return;

  form.reset();
  localStorage.removeItem(STORAGE_KEY);

  formData = {
    name: "",
    email: "",
    age: "",
    gender: "",
    photo: "",
    bio: "",
    public: false,
    theme: "light"
  };

  applyTheme("light");
}

// Застосування теми
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
}

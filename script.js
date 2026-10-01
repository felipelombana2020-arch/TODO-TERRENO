/* ==========================================================================
   TODO TERRENO - INTERACTIVIDAD Y LÓGICA (script.js)
   ========================================================================== */

// BASE DE DATOS DE CAMIONETAS 4X4
const CAMIONETAS = [
  {
    id: 1,
    nombre: "Ford F-150 Raptor R",
    categoria: "pickup",
    motor: "5.2L V8 Supercharged",
    hp: 700,
    torque: "868 Nm",
    traccion: "4WD Avanzada con Terrain Management",
    precio: 109900,
    imagen: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
    descripcion: "La reina de las pickups deportivas para volar sobre el desierto con suspensión Fox Live Valve."
  },
  {
    id: 2,
    nombre: "Jeep Wrangler Rubicon 392",
    categoria: "overland",
    motor: "6.4L HEMI V8",
    hp: 470,
    torque: "637 Nm",
    traccion: "Rock-Trac Full-Time 4x4",
    precio: 89500,
    imagen: "https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&q=80&w=1000",
    descripcion: "Especialista para trepar rocas extremas con diferenciales Tru-Lok e inmensos neumáticos de 35\"."
  },
  {
    id: 3,
    nombre: "Toyota Land Cruiser 300 GR",
    categoria: "suv",
    motor: "3.5L V6 Twin-Turbo",
    hp: 409,
    torque: "650 Nm",
    traccion: "4WD Permanente con E-KDSS",
    precio: 115000,
    imagen: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000",
    descripcion: "Fiabilidad legendaria en el desierto con chasis optimizado y suspensión electrónica adaptativa."
  },
  {
    id: 4,
    nombre: "RAM 1500 TRX Final Edition",
    categoria: "pickup",
    motor: "6.2L HEMI V8 Supercharged",
    hp: 702,
    torque: "881 Nm",
    traccion: "4x4 Permanente de Alto Rendimiento",
    precio: 112000,
    imagen: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=1000",
    descripcion: "La pickup de producción más rápida y potente del planeta, equipada con amortiguadores Bilstein Black Hawk E2."
  },
  {
    id: 5,
    nombre: "Mercedes-AMG G 63 4x4²",
    categoria: "overland",
    motor: "4.0L V8 Biturbo",
    hp: 585,
    torque: "850 Nm",
    traccion: "Ejes Portales 4x4 con 3 Diferenciales",
    precio: 349000,
    imagen: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&q=80&w=1000",
    descripcion: "Lujo extremo con ejes portales de altura colosal para atravesar cualquier río o terreno inaccesible."
  },
  {
    id: 6,
    nombre: "Defender 130 Outbound 4x4",
    categoria: "suv",
    motor: "3.0L MHEV Turbo Six",
    hp: 400,
    torque: "550 Nm",
    traccion: "AWD con Terrain Response 2",
    precio: 98000,
    imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
    descripcion: "Espacio de expedición masivo, suspensión neumática electrónica y capacidad de vadeo de 900mm."
  }
];

let currentSlide = 0;

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  initCarousel();
  renderCatalog(CAMIONETAS);
  populateSelects();
  setupCalculator();
  setupValidation();
  setupThemeToggle();
  setupFilterEvents();
  setupModalEvents();
});

// 1. MODO OSCURO / CLARO
function setupThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    if (icon) {
      icon.setAttribute("data-lucide", isDark ? "moon" : "sun");
      if (window.lucide) lucide.createIcons();
    }
  });
}

// 2. CARRUSEL HERO
function initCarousel() {
  const slidesContainer = document.getElementById("carousel-slides");
  const indicatorsContainer = document.getElementById("carousel-indicators");

  if (!slidesContainer || !indicatorsContainer) return;

  const featured = CAMIONETAS.slice(0, 3);

  slidesContainer.innerHTML = featured.map((c, idx) => `
    <div class="carousel-item absolute inset-0 transition-opacity duration-700 ${idx === 0 ? 'opacity-100' : 'opacity-0'}">
      <img src="${c.imagen}" alt="${c.nombre}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-8 sm:p-12">
        <div>
          <span class="bg-amber-600 text-white font-tech text-xs font-bold px-3 py-1 rounded-full uppercase">TRACCIÓN EXTREMA</span>
          <h2 class="font-brand text-3xl sm:text-5xl font-extrabold text-white mt-2">${c.nombre}</h2>
          <p class="text-amber-400 font-tech text-2xl mt-1 font-bold">$${c.precio.toLocaleString()} USD</p>
        </div>
      </div>
    </div>
  `).join('');

  indicatorsContainer.innerHTML = featured.map((_, idx) => `
    <button class="indicator-btn w-3 h-3 rounded-full transition-all ${idx === 0 ? 'bg-amber-500 w-8' : 'bg-gray-600'}" data-slide="${idx}"></button>
  `).join('');

  const nextBtn = document.getElementById("next-slide");
  const prevBtn = document.getElementById("prev-slide");

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  setInterval(nextSlide, 5000);
}

function showSlide(index) {
  const items = document.querySelectorAll(".carousel-item");
  const dots = document.querySelectorAll(".indicator-btn");

  items.forEach((item, idx) => {
    item.classList.toggle("opacity-100", idx === index);
    item.classList.toggle("opacity-0", idx !== index);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("bg-amber-500", idx === index);
    dot.classList.toggle("w-8", idx === index);
    dot.classList.toggle("bg-gray-600", idx !== index);
    dot.classList.toggle("w-3", idx !== index);
  });

  currentSlide = index;
}

function nextSlide() { showSlide((currentSlide + 1) % 3); }
function prevSlide() { showSlide((currentSlide - 1 + 3) % 3); }

// 3. CATALOGO DE VEHÍCULOS
function renderCatalog(items) {
  const grid = document.getElementById("trucks-grid");
  if (!grid) return;

  grid.innerHTML = items.map(c => `
    <div class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col">
      <div class="relative h-56 overflow-hidden bg-black">
        <img src="${c.imagen}" alt="${c.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100">
        <span class="absolute top-3 left-3 bg-amber-600 text-white font-tech font-bold text-xs px-2.5 py-1 rounded-md uppercase">
          4X4 READY
        </span>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 class="font-brand text-xl font-bold text-white group-hover:text-amber-500 transition-colors">${c.nombre}</h3>
          <p class="text-gray-400 text-xs mt-1 leading-relaxed">${c.descripcion}</p>
        </div>

        <div class="grid grid-cols-2 gap-2 bg-black/50 p-3 rounded-xl text-center font-tech">
          <div>
            <span class="block text-gray-500 text-xs uppercase">Potencia</span>
            <span class="text-white font-bold text-sm">${c.hp} HP</span>
          </div>
          <div>
            <span class="block text-gray-500 text-xs uppercase">Torque</span>
            <span class="text-white font-bold text-sm">${c.torque}</span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div>
            <span class="block text-xs text-gray-500 font-tech uppercase">Precio Base</span>
            <span class="text-2xl font-bold font-tech text-white">$${c.precio.toLocaleString()} USD</span>
          </div>
          <button onclick="openModal(${c.id})" class="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors glow-effect" title="Ficha Técnica">
            <i data-lucide="eye" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

// 4. FILTROS
function setupFilterEvents() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach(b => {
        b.classList.remove("bg-amber-600", "text-white");
        b.classList.add("text-gray-400");
      });
      e.target.classList.add("bg-amber-600", "text-white");
      e.target.classList.remove("text-gray-400");

      const filter = e.target.dataset.filter;
      if (filter === "all") renderCatalog(CAMIONETAS);
      else renderCatalog(CAMIONETAS.filter(c => c.categoria === filter));
    });
  });
}

// 5. SELECTS
function populateSelects() {
  const calcSelect = document.getElementById("calc-truck");
  if (calcSelect) {
    calcSelect.innerHTML = CAMIONETAS.map(c => `<option value="${c.id}">${c.nombre} ($${c.precio.toLocaleString()} USD)</option>`).join('');
  }
}

// 6. CALCULADORA FINANCIERA
function setupCalculator() {
  const select = document.getElementById("calc-truck");
  const down = document.getElementById("calc-down");
  const months = document.getElementById("calc-months");

  if (!select || !down || !months) return;

  function update() {
    const truck = CAMIONETAS.find(c => c.id == select.value) || CAMIONETAS[0];
    const downPct = parseInt(down.value) / 100;
    const totalMonths = parseInt(months.value);

    document.getElementById("calc-down-val").innerText = `${down.value}%`;
    document.getElementById("calc-months-val").innerText = `${totalMonths} Meses`;

    const initialPay = truck.precio * downPct;
    const loan = truck.precio - initialPay;
    const interest = 0.011; // 1.1% mensual
    const monthly = (loan * interest) / (1 - Math.pow(1 + interest, -totalMonths));

    document.getElementById("res-downpay").innerText = `$${Math.round(initialPay).toLocaleString()} USD`;
    document.getElementById("res-monthly").innerText = `$${Math.round(monthly).toLocaleString()} USD`;
  }

  select.addEventListener("change", update);
  down.addEventListener("input", update);
  months.addEventListener("input", update);
  update();
}

// 7. MODAL DETALLES
function openModal(id) {
  const truck = CAMIONETAS.find(c => c.id === id);
  const modal = document.getElementById("modal-details");
  const content = document.getElementById("modal-content");

  if (!modal || !content) return;

  content.innerHTML = `
    <img src="${truck.imagen}" alt="${truck.nombre}" class="w-full h-64 object-cover rounded-2xl mb-6 border border-gray-800">
    <h3 class="font-brand text-2xl font-bold text-white mb-2">${truck.nombre}</h3>
    <p class="text-gray-400 text-sm mb-6">${truck.descripcion}</p>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-black/60 p-4 rounded-2xl border border-gray-800 text-center font-tech mb-6">
      <div>
        <span class="text-xs text-gray-500 uppercase block">Motor</span>
        <span class="text-sm font-bold text-white">${truck.motor}</span>
      </div>
      <div>
        <span class="text-xs text-gray-500 uppercase block">Potencia</span>
        <span class="text-sm font-bold text-amber-500">${truck.hp} HP</span>
      </div>
      <div>
        <span class="text-xs text-gray-500 uppercase block">Torque</span>
        <span class="text-sm font-bold text-white">${truck.torque}</span>
      </div>
    </div>

    <div class="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl text-center mb-6">
      <span class="block text-xs text-amber-400 uppercase font-tech font-bold">Sistema de Tracción Integrado</span>
      <span class="text-white font-tech font-bold">${truck.traccion}</span>
    </div>

    <a href="#contacto" onclick="closeModal()" class="w-full block text-center py-4 bg-amber-600 hover:bg-amber-700 text-white font-tech font-bold uppercase rounded-xl transition-all glow-effect">
      Solicitar Cotización de este Vehículo
    </a>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("modal-details");
  if (modal) modal.classList.add("hidden");
}

function setupModalEvents() {
  const closeBtn = document.getElementById("close-modal");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
}

// 8. VALIDACIÓN DE FORMULARIO
function setupValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let valid = true;
    const name = document.getElementById("form-name")?.value.trim() || "";
    const email = document.getElementById("form-email")?.value.trim() || "";
    const phone = document.getElementById("form-phone")?.value.trim() || "";
    const msg = document.getElementById("form-message")?.value.trim() || "";

    document.getElementById("err-name")?.classList.toggle("hidden", !!name);
    document.getElementById("err-email")?.classList.toggle("hidden", email.includes("@") && email.includes("."));
    document.getElementById("err-phone")?.classList.toggle("hidden", phone.length >= 7);
    document.getElementById("err-message")?.classList.toggle("hidden", !!msg);

    if (!name || !email.includes("@") || phone.length < 7 || !msg) valid = false;

    if (valid) {
      const successBox = document.getElementById("form-success");
      if (successBox) {
        successBox.classList.remove("hidden");
        form.reset();
        setTimeout(() => successBox.classList.add("hidden"), 5000);
      }
    }
  });
}
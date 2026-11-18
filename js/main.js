// Mobile nav
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

// Opening hours (0 = Sunday). Edit here and in the Hours table.
const HOURS = {
  0: null,
  1: [10.5, 20], 2: [10.5, 20], 3: [10.5, 20], 4: [10.5, 20], 5: [10.5, 20],
  6: [12, 18],
};
const now = new Date();
const day = now.getDay();
const hourNow = now.getHours() + now.getMinutes() / 60;
const today = HOURS[day];
const isOpen = !!today && hourNow >= today[0] && hourNow < today[1];

document.querySelectorAll(".open-badge").forEach((badge) => {
  badge.classList.add(isOpen ? "is-open" : "is-closed");
  badge.querySelector("span").textContent = isOpen ? "Open now" : "Closed right now";
});
const row = document.querySelector('.hours tr[data-day="' + day + '"]');
if (row) row.classList.add("today");

// Menu filter
const chips = document.querySelectorAll(".chip");
const dishes = document.querySelectorAll(".dish[data-cat]");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    const cat = chip.dataset.filter;
    dishes.forEach((d) => { d.hidden = cat !== "all" && d.dataset.cat !== cat; });
  });
});

// Contact form (front-end only; connect to a form service when hosting)
const form = document.querySelector("#contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = document.querySelector("#form-ok");
    ok.hidden = false;
    form.reset();
    ok.focus();
  });
}

const yr = document.querySelector("#year");
if (yr) yr.textContent = new Date().getFullYear();

// Promo pop-up: opens once per visit after the visitor scrolls down a bit
(function () {
  let seen = false;
  try { seen = sessionStorage.getItem("promoSeen") === "1"; } catch (e) {}
  if (seen || typeof HTMLDialogElement === "undefined") return;

  const dlg = document.createElement("dialog");
  dlg.className = "promo";
  dlg.setAttribute("aria-labelledby", "promo-title");
  dlg.innerHTML =
    '<button class="promo-x" type="button" aria-label="Close offer">&times;</button>' +
    '<p class="eyebrow">Student special</p>' +
    '<h2 id="promo-title">10% off for JAC students</h2>' +
    '<p>Show your John Abbott College student card at the counter and get 10% off any burger, sandwich or flatbread. A free maple brownie on Fridays.</p>' +
    '<div class="actions"><a class="btn" href="' + (document.querySelector('.nav a[href$="Menu/"]') || {getAttribute:()=>'Menu/'}).getAttribute('href') + '">See the menu</a>' +
    '<button class="btn ghost" type="button" data-close>Maybe later</button></div>';
  document.body.appendChild(dlg);

  let opener = null;
  const close = () => {
    dlg.close();
    try { sessionStorage.setItem("promoSeen", "1"); } catch (e) {}
    if (opener && opener.focus) opener.focus();
  };
  dlg.querySelector(".promo-x").addEventListener("click", close);
  dlg.querySelector("[data-close]").addEventListener("click", close);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); close(); });

  let shown = false;
  const show = () => {
    if (shown) return;
    shown = true;
    window.removeEventListener("scroll", onScroll);
    opener = document.activeElement;
    dlg.showModal();
  };
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY / max > 0.4) show();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Light / dark mode toggle (remembers the choice)
(function () {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  const root = document.documentElement;
  const current = () => root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const paint = () => {
    const dark = current() === "dark";
    btn.dataset.mode = dark ? "dark" : "light";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  };
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    paint();
  });
  paint();
})();

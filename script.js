/* Bicycle Picnics Café & Bistro — proposal site JS
   Business identity: single constant. Everything else is behavior. */
"use strict";
const SITE_NAME = "Bicycle Picnics Café & Bistro";

document.documentElement.classList.remove("no-js");

(function () {
  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a") && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Entrance reveals — content is visible by default if JS fails
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll(".reveal, .reveal-mask");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  // Route-path draw on scroll (signature motif)
  const paths = document.querySelectorAll(".route-path");
  if (!reduce && "IntersectionObserver" in window) {
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = "10 8";
      p.style.transition = "none";
      const io2 = new IntersectionObserver((es) => es.forEach((en) => {
        if (en.isIntersecting) { p.classList.add("drawn"); io2.unobserve(p); }
      }), { threshold: 0.3 });
      io2.observe(p);
    });
  }

  // Demo reservation form: validate + local-only confirmation (no backend on demo)
  const form = document.getElementById("reserve-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const set = (id, msg) => {
        document.getElementById(id).textContent = msg;
        if (msg) ok = false;
      };
      const name = document.getElementById("fname").value.trim();
      const email = document.getElementById("femail").value.trim();
      const date = document.getElementById("fdate").value;
      const consent = document.getElementById("fconsent").checked;
      set("e-fname", name ? "" : "Please tell us your name.");
      set("e-femail", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email.");
      set("e-fdate", date ? "" : "Please pick a date.");
      set("e-fconsent", consent ? "" : "Please tick the consent box so we can reply.");
      if (ok) {
        document.getElementById("form-ok").hidden = false;
        form.querySelector('button[type="submit"]').disabled = true;
      }
    });
  }
})();

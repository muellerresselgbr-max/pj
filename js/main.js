/* ============================================================
   POLARIS CONCIERGE — main.js  (V2 mit GSAP Motion Layer)
   Hier anpassen:
   1. WHATSAPP        = deine WhatsApp Nummer (ohne +, ohne Leerzeichen)
   2. PHONE           = deine Telefonnummer
   3. CONVERSION_ID   = Google Ads Conversion ID (optional)
   4. CONVERSION_LABEL= Google Ads Conversion Label (optional)
   ============================================================ */

const WHATSAPP        = "4915214869594";
const PHONE           = "+49 1521 4869594";
const EMAIL           = "info@polaris-concierge.de";
const CONVERSION_ID   = "";
const CONVERSION_LABEL= "";

const WA_TEXT = encodeURIComponent("Hallo Polaris Concierge, ich interessiere mich für einen Privatjet Charter.");
const WA_URL  = "https://wa.me/" + WHATSAPP + "?text=" + WA_TEXT;
const MAIL_URL= "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Anfrage Privatjet Charter");

/* ── Links setzen ── */
document.querySelectorAll("[data-wa]").forEach(el => {
  el.href = WA_URL;
  el.target = "_blank";
  el.rel = "noopener";
  el.addEventListener("click", fireConversion);
});
document.querySelectorAll("[data-mail]").forEach(el => {
  el.href = MAIL_URL;
  el.addEventListener("click", fireConversion);
});
document.querySelectorAll("[data-phone]").forEach(el => {
  el.href = "tel:" + PHONE.replace(/\s/g,"");
  el.addEventListener("click", fireConversion);
});

const phoneDisp = document.getElementById("phoneDisp");
if (phoneDisp) phoneDisp.textContent = PHONE;

function fireConversion() {
  if (typeof gtag === "function" && CONVERSION_ID && CONVERSION_LABEL) {
    gtag("event","conversion",{"send_to": CONVERSION_ID+"/"+CONVERSION_LABEL});
  }
  document.getElementById("mobileBar")?.classList.add("hidden");
}

/* ── Header Scroll ── */
const hdr = document.getElementById("hdr");
window.addEventListener("scroll", () => {
  hdr.classList.toggle("scrolled", window.scrollY > 40);
}, {passive:true});
hdr.classList.toggle("scrolled", window.scrollY > 40);

/* ── Jahr im Footer ── */
document.getElementById("yr").textContent = new Date().getFullYear();


/* ── Flight Timeline Scroll Animation (unverändert) ── */
function initFlight() {
  const section  = document.querySelector(".process");
  const jetEl    = document.querySelector(".jet-icon");
  const trackEl  = document.querySelector(".flight-track");
  const fillEl   = document.querySelector(".track-fill");
  const dots     = document.querySelectorAll(".track-dot");
  const steps    = document.querySelectorAll(".fstep");

  if (!section || !jetEl || !trackEl || !steps.length) return;

  const JET_H = jetEl.offsetHeight || 84;

  function getMarkerY(stepIndex) {
    const tRect  = trackEl.getBoundingClientRect();
    const sRect  = steps[stepIndex].getBoundingClientRect();
    const midAbs = sRect.top + sRect.height / 2;
    return midAbs - tRect.top;
  }

  function placeDots() {
    dots.forEach((dot, i) => {
      if (steps[i]) {
        dot.style.top = (getMarkerY(i) - 6) + "px";
      }
    });
  }

  function update() {
    const secRect = section.getBoundingClientRect();
    const vh      = window.innerHeight;
    const tH      = trackEl.offsetHeight;

    const denom = Math.max(secRect.height * 0.55, vh * 0.4);
    const progress = Math.max(0, Math.min(1,
      (vh * 0.7 - secRect.top) / denom
    ));

    const pad  = 8;
    const maxY = tH - JET_H - pad;
    const jetY = pad + progress * maxY;

    jetEl.style.top = jetY + "px";

    if (fillEl) fillEl.style.height = Math.max(0, jetY + JET_H * 0.5) + "px";

    const jetCenter = jetY + JET_H / 2;

    steps.forEach((step, i) => {
      const mY      = getMarkerY(i);
      const dist    = Math.abs(jetCenter - mY);
      const isOn    = jetCenter >= mY - 30;
      const nearness= Math.max(0, 1 - dist / 80);

      if (dots[i]) dots[i].classList.toggle("active", dist < 55);

      step.classList.toggle("active", isOn);

      if (isOn) {
        step.style.borderColor  = `rgba(240,237,230,${0.1 + nearness * 0.18})`;
        step.style.boxShadow    = `inset 0 0 80px rgba(240,237,230,${nearness * 0.04}), 0 8px 40px rgba(0,0,0,0.35)`;
      } else {
        step.style.borderColor  = "";
        step.style.boxShadow    = "";
      }
    });
  }

  let raf = false;
  window.addEventListener("scroll", () => {
    if (!raf) { requestAnimationFrame(() => { update(); raf = false; }); raf = true; }
  }, {passive: true});

  window.addEventListener("resize", () => {
    placeDots();
    update();
  });

  placeDots();
  update();
}

window.addEventListener("load", () => {
  setTimeout(initFlight, 150);
});


/* ============================================================
   V2 MOTION LAYER — GSAP + Lenis
   Läuft nur wenn GSAP geladen ist. Ohne GSAP oder mit
   prefers-reduced-motion bleibt die Seite statisch nutzbar.
   ============================================================ */
(function () {
  const pre     = document.getElementById("preloader");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  function killPreloader() {
    if (pre) pre.classList.add("done");
  }

  /* Fallback: ohne GSAP / mit Reduced Motion sofort statisch zeigen */
  if (!hasGsap || reduced) {
    killPreloader();
    window.addEventListener("load", killPreloader);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis Smooth Scroll (optional, mit Fallback) ── */
  let lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.style.scrollBehavior = "auto";
  }

  const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const isMobile    = window.matchMedia("(max-width:768px)").matches;

  /* ── Startzustände (nur per JS, kein FOUC dank Preloader Overlay) ── */
  gsap.set("#hdr",               { autoAlpha: 0, y: -14 });
  gsap.set(".hero .kicker",      { autoAlpha: 0, y: 14 });
  gsap.set(".hero .h-line-in",   { yPercent: 112 });
  gsap.set(".hero .lead",        { autoAlpha: 0, y: 22 });
  gsap.set(".hero .hero-cta",    { autoAlpha: 0, y: 22 });
  gsap.set(".hero .micro",       { autoAlpha: 0 });

  /* ── Hero Intro ── */
  let introPlayed = false;
  function heroIntro() {
    if (introPlayed) return;
    introPlayed = true;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("#hdr",             { autoAlpha: 1, y: 0, duration: 0.7 }, 0.05)
      .to(".hero .kicker",    { autoAlpha: 1, y: 0, duration: 0.6 }, 0.10)
      .to(".hero .h-line-in", { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.09 }, 0.16)
      .to(".hero .lead",      { autoAlpha: 1, y: 0, duration: 0.8 }, 0.52)
      .to(".hero .hero-cta",  { autoAlpha: 1, y: 0, duration: 0.8 }, 0.64)
      .to(".hero .micro",     { autoAlpha: 1, duration: 0.7 }, 0.80);
  }

  /* ── Preloader: Boarding Sequence ── */
  function exitPreloader() {
    try { sessionStorage.setItem("pol_pl", "1"); } catch (e) {}
    gsap.timeline({ onComplete: killPreloader })
      .to(pre, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, 0)
      .add(heroIntro, 0.32);
  }

  let seen = false;
  try { seen = sessionStorage.getItem("pol_pl") === "1"; } catch (e) {}

  if (pre && !seen) {
    const plCount = document.getElementById("plCount");
    const plBar   = document.getElementById("plBar");
    const plLogo  = document.querySelector(".pl-logo");
    const p = { v: 0 };

    gsap.timeline()
      .to(plLogo, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", startAt: { y: 12 } }, 0.10)
      .to(plBar,  { scaleX: 1, duration: 1.35, ease: "power2.inOut" }, 0.15)
      .to(p, {
        v: 100, duration: 1.35, ease: "power2.inOut",
        onUpdate: () => { if (plCount) plCount.textContent = String(Math.round(p.v)).padStart(2, "0"); }
      }, 0.15)
      .add(exitPreloader, "+=0.12");

    /* Sicherheitsnetz: nach 4,5s immer freigeben */
    setTimeout(() => {
      if (pre && !pre.classList.contains("done")) { killPreloader(); heroIntro(); }
    }, 4500);
  } else {
    if (pre) gsap.set(pre, { autoAlpha: 0 });
    killPreloader();
    heroIntro();
  }

  /* ── Generische Reveals ── */
  function hide(els) { gsap.set(els, { autoAlpha: 0, y: 32 }); }

  function revealGroup(container, items, stagger) {
    const root = document.querySelector(container);
    if (!root) return;
    const els = items ? gsap.utils.toArray(container + " " + items) : [root];
    if (!els.length) return;
    hide(els);
    gsap.to(els, {
      autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
      stagger: stagger || 0,
      scrollTrigger: { trigger: container, start: "top 82%", once: true }
    });
  }

  function revealEach(selector) {
    gsap.utils.toArray(selector).forEach((el) => {
      hide(el);
      gsap.to(el, {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      });
    });
  }

  revealGroup(".trustnums .wrap", ".tn", 0.12);
  revealEach(".sec-head");
  revealGroup(".adv-grid", ".adv-card", 0.10);
  revealGroup(".ctable", ".crow", 0.05);
  revealEach(".compare-note");
  revealEach(".cta-inline");
  revealEach(".events .reveal:not(.leg-list)");
  revealGroup(".leg-list", ".leg", 0.08);
  revealEach(".founder-box");
  revealGroup(".voice-grid", ".voice", 0.10);
  revealGroup(".contact-grid", ".contact-card", 0.10);
  revealEach(".vetting");
  revealEach(".foot-grid");

  /* ── Zahlen zählen hoch ── */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.getAttribute("data-count"));
    const suf = el.getAttribute("data-suffix") || "";
    const de  = el.getAttribute("data-format") === "de";
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: end, duration: 1.6, ease: "power2.out",
          onUpdate: () => {
            const n = Math.round(obj.v);
            el.textContent = (de ? n.toLocaleString("de-DE") : String(n)) + suf;
          }
        });
      }
    });
  });

  /* ── Showcase: Bild setzt sich, Worte steigen auf ── */
  const sImg = document.querySelector(".showcase-img");
  if (sImg) {
    gsap.fromTo(sImg,
      { clipPath: "inset(14% 7% 14% 7%)", scale: 1.12 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.5, ease: "power3.out",
        scrollTrigger: { trigger: ".showcase", start: "top 75%", once: true } });
  }
  const sq = document.querySelector("[data-split-words]");
  if (sq) {
    const words = sq.textContent.trim().split(/\s+/);
    sq.innerHTML = words.map(w => '<span class="w"><span class="w-in">' + w + "</span></span>").join(" ");
    const wraps  = sq.querySelectorAll(".w");
    const inners = sq.querySelectorAll(".w-in");
    gsap.set(wraps,  { display: "inline-block", overflow: "hidden", verticalAlign: "bottom" });
    gsap.set(inners, { display: "inline-block", yPercent: 115 });
    gsap.to(inners, {
      yPercent: 0, duration: 0.95, ease: "power4.out", stagger: 0.12,
      scrollTrigger: { trigger: ".showcase", start: "top 68%", once: true }
    });
  }

  /* ── Magnetic Buttons + Card Spotlight (nur Desktop) ── */
  if (finePointer && !isMobile) {
    document.querySelectorAll(".hero .btn-primary, .cta-inline .btn-primary").forEach((btn) => {
      btn.style.transition = "box-shadow .25s ease, background .25s ease, border-color .25s ease";
      const qx = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3" });
      const qy = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3" });
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.18);
        qy((e.clientY - (r.top + r.height / 2)) * 0.22);
      });
      btn.addEventListener("mouseleave", () => { qx(0); qy(0); });
    });

    document.querySelectorAll(".adv-card, .contact-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  /* ── Nach komplettem Laden Positionen neu messen ── */
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();

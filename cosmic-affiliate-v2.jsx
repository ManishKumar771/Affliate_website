import { useState, useEffect, useRef, useCallback } from "react";

// ── GLOBAL STYLES injected into <head> ──────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html {
      scroll-behavior: smooth;
      width: 100%;
      max-width: 100vw;
      overflow-x: hidden;
    }

    :root {
      --pink: #ff2d9b;
      --blue: #00d4ff;
      --purple: #7b2fff;
      --violet: #c044ff;
      --dark: #02000a;
      --darker: #060314;
      --card: rgba(8, 4, 24, 0.82);
      --border-pink: rgba(255,45,155,0.25);
      --border-blue: rgba(0,212,255,0.25);
      --text-dim: rgba(255,255,255,0.45);
    }

    body {
      background: var(--dark);
      font-family: 'Space Mono', monospace;
      color: #fff;
      overflow-x: hidden;
      width: 100%;
      max-width: 100vw;
      min-height: 100vh;
    }

    #stars-canvas {
      position: fixed; inset:0;
      width:100%; height:100%;
      pointer-events:none; z-index:0;
    }

    .neb { position:fixed; border-radius:50%; filter:blur(90px); opacity:.16; pointer-events:none; z-index:0; }
    .neb1 { width:700px;height:700px;background:radial-gradient(circle,var(--pink),transparent 70%);top:-200px;left:-200px;animation:drift1 24s ease-in-out infinite alternate; }
    .neb2 { width:600px;height:600px;background:radial-gradient(circle,var(--blue),transparent 70%);bottom:-150px;right:-150px;animation:drift2 28s ease-in-out infinite alternate; }
    .neb3 { width:450px;height:450px;background:radial-gradient(circle,var(--violet),transparent 70%);top:45%;left:45%;animation:drift3 20s ease-in-out infinite alternate; }

    @keyframes drift1 { to { transform: translate(80px, 60px) scale(1.15); } }
    @keyframes drift2 { to { transform: translate(-60px, -40px) scale(1.1); } }
    @keyframes drift3 { to { transform: translate(-80px, 70px) scale(0.9); } }

    /* subtle noise layer removed to keep images crisp */

    .site-header {
      position:relative; z-index:10;
      text-align:center;
      padding: 80px 24px 40px;
    }
    .logo-wrap { display:inline-block; position:relative; }
    .logo-text {
      font-family:'Syne',sans-serif;
      font-size: clamp(3rem,8vw,6.5rem);
      font-weight:800;
      letter-spacing:-0.02em;
      line-height:1;
      background: linear-gradient(135deg, #fff 0%, var(--pink) 35%, var(--blue) 65%, var(--violet) 100%);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      animation: logoShimmer 6s linear infinite;
      background-size:200%;
    }
    @keyframes logoShimmer {
      0% { background-position:0% 50%; }
      50% { background-position:100% 50%; }
      100% { background-position:0% 50%; }
    }
    .logo-sub {
      font-size:.72rem; letter-spacing:.45em; text-transform:uppercase;
      color: var(--text-dim); margin-top:10px; display:block;
    }
    .logo-line {
      display:block; width:100%; height:1px; margin-top:16px;
      background: linear-gradient(90deg, transparent, var(--pink), var(--blue), transparent);
      animation: lineGlow 4s ease-in-out infinite alternate;
    }
    @keyframes lineGlow {
      0% { opacity:.5; } 100% { opacity:1; }
    }

    .site-nav {
      position:relative; z-index:10;
      display:flex; justify-content:center; gap:40px;
      padding:18px 24px;
      border-top: 1px solid rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      background: rgba(2,0,10,0.4);
    }
    .nav-link {
      font-family:'Syne',sans-serif; font-size:.7rem; font-weight:700;
      letter-spacing:.25em; text-transform:uppercase;
      color:var(--text-dim); text-decoration:none;
      transition:color .3s; position:relative; padding-bottom:4px;
    }
    .nav-link::after {
      content:''; position:absolute; bottom:0; left:0;
      width:0; height:1px;
      background:linear-gradient(90deg,var(--pink),var(--blue));
      transition:width .35s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .nav-link:hover { color:#fff; }
    .nav-link:hover::after { width:100%; }

    .sec-head {
      text-align:center; position:relative; z-index:10;
      margin-bottom:48px; padding-top:70px;
    }
    .sec-eyebrow {
      font-size:.6rem; letter-spacing:.5em; text-transform:uppercase;
      color:var(--blue); margin-bottom:10px; display:block;
    }
    .sec-title {
      font-family:'Syne',sans-serif;
      font-size:clamp(1.8rem,4vw,3rem);
      font-weight:800; letter-spacing:-.01em;
      line-height:1.1;
    }
    .sec-title em { font-style:normal; color:var(--pink); }
    .sec-title::after {
      content:''; display:block; width:60px; height:2px; margin:16px auto 0;
      background:linear-gradient(90deg,var(--pink),var(--blue));
      border-radius:2px;
    }

    .about-section {
      position:relative; z-index:10;
      max-width:720px;
      margin:40px auto 10px;
      padding:0 24px 40px;
      text-align:left;
    }
    .about-section p {
      font-size:.8rem;
      line-height:1.8;
      color:var(--text-dim);
    }

    .products-section {
      position:relative; z-index:10;
      padding:0 16px 80px;
    }
    .products-grid {
      display:grid;
      grid-template-columns: repeat(auto-fill, minmax(310px,1fr));
      gap:30px;
      max-width:1140px; margin:0 auto;
    }

    .p-card {
      position:relative;
      background:var(--card);
      border:1px solid var(--border-blue);
      border-radius:20px;
      overflow:visible;
      transition:transform .4s cubic-bezier(0.34,1.56,0.64,1), box-shadow .4s ease, border-color .4s;
      backdrop-filter:blur(16px);
      transform-style:preserve-3d;
    }
    .p-card::before {
      content:''; position:absolute; inset:0; border-radius:20px;
      background:linear-gradient(135deg, rgba(0,212,255,0.04), rgba(255,45,155,0.04));
      z-index:0; pointer-events:none;
    }
    .p-card:hover {
      transform: translateY(-12px) rotateX(2deg);
      box-shadow:
        0 30px 80px rgba(0,0,0,0.6),
        0 0 40px rgba(0,212,255,0.2),
        0 0 80px rgba(255,45,155,0.1);
      border-color:rgba(0,212,255,0.5);
    }

    .alien-peek {
      position:absolute;
      right:-88px; top:50%;
      width:80px; text-align:center;
      pointer-events:none;
      z-index:200; filter:drop-shadow(0 0 14px rgba(0,212,255,0.9));
      transition: opacity .25s ease, transform .35s cubic-bezier(0.34,1.56,0.64,1);
      will-change: transform, opacity;
    }
    .alien-peek .a-body { font-size:52px; display:block; animation:alienBob 1.1s ease-in-out infinite alternate; line-height:1; }
    .alien-peek .a-eye  { font-size:16px; display:block; margin-top:-8px; animation:blinkEye 2.5s infinite; }
    @keyframes alienBob {
      0%   { transform:translateY(0) rotate(-8deg); }
      100% { transform:translateY(-8px) rotate(8deg); }
    }
    @keyframes blinkEye {
      0%,88%,100% { transform:scaleY(1); }
      92% { transform:scaleY(0.05); }
    }

    .card-img {
      width:100%; height:210px; overflow:hidden;
      border-radius:20px 20px 0 0; position:relative; z-index:1;
      background:#050214;
    }
    .card-img img {
      width:100%; height:100%; object-fit:cover;
      display:block;
      image-rendering:auto;
      transition:transform .6s cubic-bezier(0.25,0.46,0.45,0.94);
    }
    .p-card:hover .card-img img { transform:scale(1.1); }
    .card-img-overlay {
      position:absolute; inset:0;
      background:linear-gradient(to top, rgba(2,0,10,.7) 0%, transparent 50%);
      z-index:2;
    }
    .badge {
      position:absolute; top:14px; left:14px; z-index:3;
      padding:4px 12px; border-radius:99px;
      font-family:'Syne',sans-serif; font-size:.58rem; font-weight:700;
      letter-spacing:.12em; text-transform:uppercase;
      background:linear-gradient(135deg,var(--pink),var(--purple));
      color:#fff; box-shadow:0 2px 12px rgba(255,45,155,0.5);
    }

    .card-body { padding:22px; position:relative; z-index:1; }
    .card-cat {
      font-size:.6rem; letter-spacing:.3em; text-transform:uppercase;
      color:var(--blue); margin-bottom:6px; display:block;
    }
    .card-title {
      font-family:'Syne',sans-serif; font-size:1rem; font-weight:700;
      margin-bottom:8px; line-height:1.3; color:#fff;
    }
    .card-desc {
      font-size:.75rem; line-height:1.7;
      color:var(--text-dim); margin-bottom:18px;
    }
    .card-price {
      font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800;
      color:var(--pink); display:flex; align-items:baseline; gap:10px;
      margin-bottom:16px;
    }
    .card-price .was {
      font-size:.78rem; font-weight:400;
      color:rgba(255,255,255,.25); text-decoration:line-through;
      font-family:'Space Mono',monospace;
    }
    .card-price .save {
      font-size:.65rem; padding:2px 8px; border-radius:6px;
      background:rgba(255,45,155,.15); color:var(--pink);
      font-family:'Space Mono',monospace;
    }

    .btn-buy {
      display:flex; align-items:center; justify-content:center; gap:8px;
      width:100%; padding:13px;
      background:linear-gradient(135deg,var(--pink) 0%,var(--purple) 50%,var(--blue) 100%);
      background-size:200%;
      color:#fff; font-family:'Syne',sans-serif; font-size:.7rem;
      font-weight:700; letter-spacing:.15em; text-transform:uppercase;
      text-decoration:none; border-radius:10px;
      transition:background-position .4s ease, transform .2s, box-shadow .3s;
      box-shadow:0 4px 20px rgba(255,45,155,0.3);
      position:relative; overflow:hidden;
    }
    .btn-buy::after {
      content:''; position:absolute; top:0; left:-100%;
      width:60%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
      transition:left .5s ease;
    }
    .btn-buy:hover {
      background-position:right center;
      transform:scale(0.98);
      box-shadow:0 6px 30px rgba(255,45,155,0.5);
    }
    .btn-buy:hover::after { left:150%; }

    .stars { color:#ffd95e; font-size:.8rem; letter-spacing:2px; margin-bottom:12px; display:block; }
    .stars span { color:var(--text-dim); font-size:.65rem; font-family:'Space Mono'; }

    .reveal { opacity:0; transform:translateY(40px); transition:opacity .8s ease, transform .8s ease; }
    .reveal.in { opacity:1; transform:translateY(0); }

    .site-footer {
      position:relative; z-index:10;
      text-align:center; padding:40px 24px;
      border-top:1px solid rgba(255,255,255,0.06);
    }
    .footer-logo {
      font-family:'Syne',sans-serif; font-size:1.4rem; font-weight:800;
      background:linear-gradient(135deg,var(--pink),var(--blue));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      margin-bottom:12px; display:block;
    }
    .footer-note { font-size:.65rem; color:rgba(255,255,255,.2); letter-spacing:.15em; line-height:2; }

    /* scanline effect removed for cleaner images */

    .contact-section {
      position:relative; z-index:10;
      max-width:960px;
      margin:40px auto 80px;
      padding:24px 28px;
      background:var(--card);
      border-radius:18px;
      border:1px solid var(--border-blue);
      box-shadow:0 16px 40px rgba(0,0,0,0.6);
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      justify-content:space-between;
      gap:16px 32px;
      font-family:'Space Mono',monospace;
    }
    .contact-section h3 {
      font-family:'Syne',sans-serif; font-size:.68rem; font-weight:700;
      letter-spacing:.35em; text-transform:uppercase;
      color:var(--blue); margin:0; display:flex; align-items:center; gap:8px;
    }
    .contact-section h3 .cosmic-mini {
      display:inline-flex; gap:4px; font-size:.8rem;
    }
    .contact-section a {
      display:flex; align-items:center; gap:10px;
      color:rgba(255,255,255,0.85);
      text-decoration:none; font-size:.78rem;
      padding:8px 0;
      transition:color .25s, transform .2s;
      border-radius:8px;
    }
    .contact-section a:hover {
      color:var(--pink);
      transform:translateX(4px);
    }
    .contact-section .contact-icon {
      display:inline-flex; align-items:center; justify-content:center;
      width:22px; height:22px;
      flex-shrink:0;
      transition:transform .25s ease;
    }
    .contact-section a:hover .contact-icon {
      transform: scale(1.12);
    }

    @media (max-width:640px) {
      .site-header {
        padding: 56px 16px 28px;
      }
      .logo-text {
        font-size: clamp(2.2rem, 9vw, 3rem);
        line-height: 1.05;
      }
      .products-grid { grid-template-columns:1fr; }
      .alien-peek { display:none; }
      .site-nav {
        gap:16px;
        flex-wrap:wrap;
        padding-inline:16px;
      }
      .products-section {
        padding:0 12px 64px;
      }
      .contact-section {
        margin:32px 16px 72px;
        padding:16px 18px;
        flex-direction:column;
        align-items:flex-start;
      }
      #stars-canvas { display:none; }
      .neb { display:none; }
      .scanline { display:none; }
    }
  `}</style>
);

// ── DATA ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    category: "Grooming / Hair Care",
    title: "Man Matters Hair Strengthening Serum",
    desc: "Argan & jojoba oils lock moisture, reduce frizz. Vitamins E & A strengthen and thicken strands. No mineral oils. 90ml.",
    price: "Check Price",
    was: "",
    save: "Best Seller",
    badge: "✨ Top Pick",
    rating: 4.7,
    reviews: 2840,
    alien: "👽",
    eye: "🌀",
    img: "/man-matters-hair-serum.png",
    link: "https://amzn.to/3ZZfNnj",
  },
  {
    id: 2,
    category: "Sun Care / SPF",
    title: "Minimalist SPF 50 Lightweight Sunscreen",
    desc: "Lightweight broad-spectrum SPF 50, absorbs easily. In vivo tested in US. Niacinamide, vitamin B5 & F. Suitable for all skin types. 50g.",
    price: "Check Price",
    was: "",
    save: "Derm Pick",
    badge: "🌞 Daily Essential",
    rating: 4.6,
    reviews: 3120,
    alien: "👾",
    eye: "✨",
    img: "/minimalist-spf50.png",
    link: "https://amzn.to/4rMUVvM",
  },
  {
    id: 3,
    category: "Fragrance / Perfume",
    title: "Ajmal ASCEND Eau de Parfum 100ml",
    desc: "Luxury scent in gradient glass bottle. Black & silver design. Bold, lasting fragrance for confident wear.",
    price: "Check Price",
    was: "",
    save: "Top Seller",
    badge: "✨ Premium",
    rating: 4.6,
    reviews: 2150,
    alien: "🛸",
    eye: "👁️",
    img: "/ajmal-ascend-perfume.png",
    link: "https://amzn.to/4bmqjdF",
  },
  {
    id: 4,
    category: "Health / Supplements",
    title: "Cortisol Support Nutraceutical",
    desc: "For stress relief and deep sleep. Supports healthy cortisol, better energy. Adaptogens smoothen the stress response cycle.",
    price: "Check Price",
    was: "",
    save: "Overworked Pick",
    badge: "💊 Science-Backed",
    rating: 4.5,
    reviews: 1890,
    alien: "😈",
    eye: "🔭",
    img: "/cortisol-support.png",
    link: "https://amzn.to/4cm9l12",
  },
  {
    id: 5,
    category: "Beauty / Lip Care",
    title: "Vaseline Lip Tins Cocoa Butter 17g",
    desc: "Infused with cocoa butter for hydration and glossy shine. Moisturizes dry, chapped lips. Dermatologically tested. Non-sticky.",
    price: "Check Price",
    was: "",
    save: "3K+ Bought",
    badge: "💋 Best Seller",
    rating: 4.5,
    reviews: 2776,
    alien: "🤖",
    eye: "🌟",
    img: "/Screenshot 2026-03-02 225259.png",
    link: "https://amzn.to/3NbT8Bh",
  },
  {
    id: 6,
    category: "Personal Care / Gum",
    title: "Mint Chewing Gum",
    desc: "Fresh mint flavour, natural breath freshener. Compact box, easy to carry. Fresh breath on the go.",
    price: "Check Price",
    was: "",
    save: "Fresh Pick",
    badge: "🍃 Mint Fresh",
    rating: 4.4,
    reviews: 890,
    alien: "👻",
    eye: "💫",
    img: "/chewing-gum.png",
    link: "https://amzn.to/4sg24V3",
  },
];

// Track cursor for proximity-based alien peek
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

function Stars({ rating, reviews }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars">
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      <span> {rating} ({reviews.toLocaleString()})</span>
    </span>
  );
}

const APPROACH_ZONE = 220; // px – cursor within this distance triggers alien

function ProductCard({ product, delay, mousePos }) {
  const cardRef = useRef(null);

  // Cursor proximity: 0 = far, 1 = cursor very close to card
  const peek = (() => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mousePos.x - cx;
    const dy = mousePos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > APPROACH_ZONE) return 0;
    return 1 - dist / APPROACH_ZONE;
  })();

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-12px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  }, []);

  return (
    <div
      ref={cardRef}
      className="p-card reveal"
      style={{ transitionDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="alien-peek"
        style={{
          opacity: peek,
          transform: `translateY(-50%) translateX(${20 + (1 - peek) * 70}px)`,
          visibility: peek > 0.02 ? "visible" : "hidden",
        }}
      >
        <span className="a-body">{product.alien}</span>
        <span className="a-eye">{product.eye}</span>
      </div>

      <div className="card-img">
        <img src={product.img} alt={product.title} loading="lazy" />
        <div className="card-img-overlay" />
        <span className="badge">{product.badge}</span>
      </div>

      <div className="card-body">
        <span className="card-cat">{product.category}</span>
        <h3 className="card-title">{product.title}</h3>
        <Stars rating={product.rating} reviews={product.reviews} />
        <p className="card-desc">{product.desc}</p>
        <div className="card-price">
          {product.price}
          {product.was && <span className="was">{product.was}</span>}
          {product.save && <span className="save">{product.save}</span>}
        </div>
        <a href={product.link} target="_blank" rel="noopener noreferrer" className="btn-buy">
          <span>🚀</span> Beam Me There
        </a>
      </div>
    </div>
  );
}

function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
    const isSmallScreen = window.innerWidth <= 640;
    if (prefersReduced || isSmallScreen) {
      return;
    }

    const ctx = canvas.getContext("2d");
    let animId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.25 + 0.04,
        twinkle: Math.random() * 0.018 + 0.004,
        dir: Math.random() > 0.5 ? 1 : -1,
        color: ["#ffffff","#a8d8ff","#ffb3e6","#c4b5fd"][Math.floor(Math.random() * 4)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.twinkle * s.dir;
        if (s.alpha > 0.9 || s.alpha < 0.1) s.dir *= -1;
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="stars-canvas" ref={canvasRef} />;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("in"), i * 90);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function GmailIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L2.455 5.457v10.91h3.273V7.091l6.273 4.728 6.273-4.728v9.273h3.273V5.457l-1.455-1.091C21.69 2.28 24 3.434 24 5.457z"/>
      <path fill="#4285F4" d="M16.364 11.73L24 6.545V5.457c0-.523-.272-.982-.655-1.273l-7.636 7.546z"/>
      <path fill="#34A853" d="M12 16.64l4.364-3.273 3.273 2.454.727-.546V5.457l-1.455-1.091-6.545 6.273-6.273-4.728z"/>
      <path fill="#FBBC05" d="M7.636 11.91l-5.091-4-1.09.819v10.91h6.182V11.91z"/>
    </svg>
  );
}

function ContactSection() {
  return (
    <aside className="contact-section" id="contact">
      <h3>
        <span className="cosmic-mini">✦ 🪐 ✦</span>
        Get in Touch
      </h3>
      <a href="https://www.instagram.com/manishxsirswa?igsh=dHRlbGgyMmJrcWZ5" target="_blank" rel="noopener noreferrer">
        <InstagramIcon className="contact-icon" />
        @manishxsirswa
      </a>
      <a href="mailto:sirswamani@gmail.com">
        <GmailIcon className="contact-icon" />
        sirswamani@gmail.com
      </a>
    </aside>
  );
}

export default function App() {
  useScrollReveal();
  const mousePos = useMousePosition();

  return (
    <>
      <GlobalStyle />
      <Starfield />

      <div className="neb neb1" />
      <div className="neb neb2" />
      <div className="neb neb3" />

      <header className="site-header">
        <div className="logo-wrap reveal">
          <h1 className="logo-text">✦ CosmicDeals ✦</h1>
          <span className="logo-sub">Products from another dimension</span>
          <span className="logo-line" />
        </div>
      </header>

      <nav className="site-nav">
        {["Products", "About", "Contact"].map((n) => (
          <a key={n} href={"/#" + n.toLowerCase()} className="nav-link">{n}</a>
        ))}
      </nav>

      <section id="about" className="about-section">
        <p className="reveal">
          CosmicDeals is your tiny portal for handpicked products that feel just a little bit
          otherworldly. Every item on this page is curated for everyday use, with a clean,
          distraction-free layout so you can browse fast on mobile or desktop without any lag.
        </p>
      </section>

      <section id="products" className="products-section">
        <div className="sec-head reveal">
          <span className="sec-eyebrow">✦ Handpicked from the cosmos</span>
          <h2 className="sec-title">Featured <em>Deals</em></h2>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 80} mousePos={mousePos} />
          ))}
        </div>
      </section>

      <ContactSection />

      <footer className="site-footer">
        <span className="footer-logo">✦ CosmicDeals</span>
        <p className="footer-note">
          AFFILIATE DISCLOSURE — WE MAY EARN A COMMISSION ON PURCHASES<br />
          ALL PRICES ARE APPROXIMATE AND SUBJECT TO CHANGE
        </p>
      </footer>
    </>
  );
}

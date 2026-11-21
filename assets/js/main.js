/* KiteTerm 官网交互:主题切换 / 移动端菜单 / 复制代码 / 滚动显现 / 滚动进度与导航高亮 /
   卡片聚光 / 数字滚动 / Hero 粒子网络 / Hero 终端演示 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 主题切换 ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('kt-theme', next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#070a12' : '#f4f7fb');
      if (window.__ktParticlesRecolor) window.__ktParticlesRecolor();
    });
  }

  /* ---------- 移动端菜单 ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    var setMenu = function (open) {
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    };
    navToggle.addEventListener('click', function () {
      setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenu(false);
        navToggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        setMenu(false);
      }
    });
  }

  /* ---------- 复制代码块 ---------- */
  var copyBtns = document.querySelectorAll('.copy-btn[data-copy]');
  Array.prototype.forEach.call(copyBtns, function (btn) {
    var label = btn.lastChild;
    var original = label.textContent;
    var timer = null;
    var show = function (ok) {
      label.textContent = ok ? '已复制' : '复制失败';
      clearTimeout(timer);
      timer = setTimeout(function () { label.textContent = original; }, 1600);
    };
    btn.addEventListener('click', function () {
      var pre = document.getElementById(btn.getAttribute('data-copy'));
      if (!pre) return;
      var text = pre.innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { show(true); },
          function () { show(fallbackCopy(text)); }
        );
      } else {
        show(fallbackCopy(text));
      }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- 滚动显现 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 滚动进度条 / 导航阴影 / 当前分区高亮 ---------- */
  var nav = document.getElementById('siteNav');
  var bar = document.getElementById('scrollProgress');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (bar) bar.style.transform = 'scaleX(' + ratio + ')';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (navLinks && 'IntersectionObserver' in window) {
    var linkMap = {};
    Array.prototype.forEach.call(navLinks.querySelectorAll('a[href^="#"]'), function (a) {
      linkMap[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = linkMap[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkMap).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* ---------- 卡片鼠标聚光 ---------- */
  var spotSel = '.feature, .sec-card, .arch-box, .dl-card, .kb';
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var card = e.target.closest && e.target.closest(spotSel);
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- 数字滚动 ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var start = null, dur = 1400;
    el.textContent = '0';
    (function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    })(performance.now());
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  }

  /* ---------- Hero 粒子网络 ---------- */
  (function particles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, pts = [], rgb = '95, 225, 243', running = false, visible = true, raf = 0;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 130;

    function readColor() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim();
      if (v) rgb = v;
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, Math.max(28, (w * h) / 16000)));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (running) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.16 * (1 - Math.sqrt(d2) / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 170) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + (0.35 * (1 - md / 170)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(' + rgb + ',0.75)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function loop() {
      draw();
      raf = running && visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    }
    function kick() { if (!raf && running && visible && !document.hidden) raf = requestAnimationFrame(loop); }

    readColor(); resize();
    running = !reduceMotion;
    draw(); kick();

    window.__ktParticlesRecolor = function () { readColor(); if (!running) draw(); };
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(function () { resize(); draw(); }, 150);
    });
    document.addEventListener('visibilitychange', kick);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(canvas);
    }
    var hero = canvas.closest('.hero');
    if (hero && running) {
      hero.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      }, { passive: true });
      hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    }
  })();

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Hero 终端演示:白话 → AI 命令 ---------- */
  var typed = document.getElementById('demoTyped');
  var aiCard = document.getElementById('demoAi');
  var aiCmd = document.getElementById('demoCmd');
  if (!typed || !aiCard || !aiCmd) return;

  var scenes = [
    { say: '看看哪个进程最吃内存', cmd: 'ps aux --sort=-%mem | head -n 6' },
    { say: '把 8080 端口的进程找出来', cmd: 'lsof -i :8080 -sTCP:LISTEN' },
    { say: '最近一小时的错误日志有多少条', cmd: 'journalctl --since "1 hour ago" -p err | wc -l' },
    { say: '磁盘哪个目录最大', cmd: 'du -xh --max-depth=1 / 2>/dev/null | sort -rh | head' }
  ];

  if (reduceMotion) {
    typed.textContent = scenes[0].say;
    aiCmd.textContent = scenes[0].cmd;
    aiCard.classList.add('show');
    return;
  }

  var idx = 0;
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function typeText(el, text, speed) {
    return new Promise(function (resolve) {
      var i = 0;
      el.textContent = '';
      (function step() {
        if (i < text.length) {
          el.textContent += text.charAt(i++);
          setTimeout(step, speed + Math.random() * 60);
        } else resolve();
      })();
    });
  }

  function eraseText(el) {
    return new Promise(function (resolve) {
      (function step() {
        var t = el.textContent;
        if (t.length) { el.textContent = t.slice(0, -1); setTimeout(step, 18); }
        else resolve();
      })();
    });
  }

  function run() {
    var s = scenes[idx % scenes.length];
    idx += 1;
    aiCard.classList.remove('show');
    aiCmd.textContent = '';
    wait(700)
      .then(function () { return typeText(typed, s.say, 70); })
      .then(function () { return wait(500); })
      .then(function () { aiCmd.textContent = ''; aiCard.classList.add('show'); return wait(350); })
      .then(function () { return typeText(aiCmd, s.cmd, 22); })
      .then(function () { return wait(3200); })
      .then(function () { aiCard.classList.remove('show'); return wait(300); })
      .then(function () { return eraseText(typed); })
      .then(function () { return wait(400); })
      .then(run);
  }
  run();
})();

/* KiteTerm 官网交互:主题切换 / 移动端菜单 / 复制代码 / 滚动显现 / Hero 终端演示 */
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
      if (meta) meta.setAttribute('content', next === 'dark' ? '#0a0c14' : '#f6f8fb');
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

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Hero 终端演示:白话 → AI 命令 ---------- */
  var typed = document.getElementById('demoTyped');
  var aiCard = document.getElementById('demoAi');
  var aiCmd = document.getElementById('demoCmd');
  if (!typed || !aiCard || !aiCmd) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scenes = [
    { say: '看看哪个进程最吃内存', cmd: 'ps aux --sort=-%mem | head -n 6' },
    { say: '把 8080 端口的进程找出来', cmd: 'lsof -i :8080 -sTCP:LISTEN' },
    { say: '最近一小时的错误日志有多少条', cmd: 'journalctl --since "1 hour ago" -p err | wc -l' },
    { say: '磁盘哪个目录最大', cmd: 'du -xh --max-depth=1 / 2>/dev/null | sort -rh | head' }
  ];

  if (reduce) {
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

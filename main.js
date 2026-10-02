/* ============================================================
   Peril Talaviya — portfolio behaviour
   No dependencies. Everything degrades gracefully without JS.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* ------------------------------------------------ theme */
  var toggle = document.getElementById("themeToggle");

  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("pt-theme", t); } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", t === "dark" ? "#15111C" : "#FFFCF7");
    if (toggle) {
      toggle.setAttribute("aria-label",
        t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  if (toggle) {
    setTheme(root.getAttribute("data-theme") || "light");
    toggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ------------------------------------------------ mobile menu */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mmenu");

  function closeMenu() {
    if (!menu || !burger) return;
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.hidden;
      menu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (innerWidth > 760) closeMenu(); });
  }

  /* ------------------------------------------------ reveals */
  var revealables = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var sibs = el.parentElement ? [].slice.call(el.parentElement.children) : [];
        var i = sibs.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 6) * 55 : 0) + "ms";
        el.classList.add("in");
        ro.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    revealables.forEach(function (el) { ro.observe(el); });

    // never leave the page blank if the observer misbehaves
    setTimeout(function () {
      revealables.forEach(function (el) { el.classList.add("in"); });
    }, 2200);
  }

  /* ------------------------------------------------ scroll spy */
  var sections = [].slice.call(document.querySelectorAll("section[id]"));
  var links = [].slice.call(document.querySelectorAll(".navlinks a"));

  function spy() {
    var y = scrollY + 130, cur = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    if (innerHeight + scrollY >= document.body.offsetHeight - 24 && sections.length) {
      cur = sections[sections.length - 1].id;
    }
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }

  var tick = false;
  addEventListener("scroll", function () {
    if (tick) return;
    tick = true;
    requestAnimationFrame(function () { spy(); tick = false; });
  }, { passive: true });
  spy();

  /* ------------------------------------------------ terminal */
  var typed = document.getElementById("typed");
  var caret = document.getElementById("caret");
  var out = document.getElementById("termOut");
  var form = document.getElementById("termForm");
  var input = document.getElementById("termIn");

  var INTRO = [
    ['<span class="k">name</span> Peril Talaviya'],
    ['<span class="k">role</span> Software Engineer'],
    ['<span class="k">stack</span> node · nest · react · mongo · azure'],
    ['<span class="k">likes</span> clean APIs, small teams, shipping']
  ];

  var COMMANDS = {
    help: ['available: <span class="pr">whoami</span>, <span class="pr">stack</span>, ' +
           '<span class="pr">experience</span>, <span class="pr">contact</span>, ' +
           '<span class="pr">theme</span>, <span class="pr">clear</span>'],
    whoami: ['<span class="k">name</span> Peril Talaviya',
             '<span class="k">role</span> Software Engineer',
             '<span class="k">where</span> Bengaluru, India'],
    stack: ['<span class="k">lang</span> TypeScript · JavaScript · Python',
            '<span class="k">back</span> Node.js · NestJS · MongoDB · Redis',
            '<span class="k">front</span> React · Konva',
            '<span class="k">cloud</span> Azure · Docker · OpenTofu · GitHub Actions'],
    experience: ['<span class="k">now</span> Founding Engineer, Zephyr Pvt Ltd (Sep 2023 →)',
                 '<span class="k">before</span> Associate SDE 1, Actyv.ai (Jan – Aug 2023)'],
    contact: ['<span class="k">mail</span> periltalaviya123@gmail.com',
              '<span class="k">git</span> github.com/periltalaviya',
              '<span class="k">in</span> linkedin.com/in/peril-talaviya-6128bb210'],
    theme: ['<span class="ok">✓</span> theme switched'],
    clear: []
  };

  function println(html) {
    var p = document.createElement("p");
    p.innerHTML = html;
    out.appendChild(p);
  }

  function run(raw) {
    var cmd = (raw || "").trim().toLowerCase();
    if (!cmd) return;
    println('<span class="pr">❯</span> ' + cmd.replace(/[<>&]/g, ""));

    if (cmd === "clear") {
      out.innerHTML = "";
      return;
    }
    if (COMMANDS[cmd]) {
      COMMANDS[cmd].forEach(println);
      if (cmd === "theme") {
        setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      }
    } else {
      println('<span class="err">command not found:</span> ' + cmd.replace(/[<>&]/g, "") +
              ' — try <span class="pr">help</span>');
    }
  }

  if (form && input) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      run(input.value);
      input.value = "";
      input.scrollIntoView({ block: "nearest" });
    });
    document.querySelectorAll(".key").forEach(function (b) {
      b.addEventListener("click", function () { run(b.dataset.cmd); input.focus(); });
    });
  }

  // type the opening command, then print the intro block
  if (typed) {
    var text = "whoami";
    function finish() {
      if (caret) caret.style.display = "none";
      INTRO.forEach(function (l) { println(l[0]); });
    }
    if (reduce) {
      typed.textContent = text;
      finish();
    } else {
      var n = 0;
      var started = false;
      function type() {
        typed.textContent = text.slice(0, n);
        n++;
        if (n <= text.length) setTimeout(type, 70 + Math.random() * 60);
        else setTimeout(finish, 280);
      }
      function start() { if (!started) { started = true; setTimeout(type, 500); } }
      if ("IntersectionObserver" in window) {
        var to = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { start(); to.disconnect(); } });
        }, { threshold: .3 });
        to.observe(document.getElementById("term") || typed);
      } else start();
    }
  }
})();

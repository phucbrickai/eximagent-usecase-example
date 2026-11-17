(function () {
  var p = document.querySelector("[data-player]");
  if (!p) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chs = p.querySelectorAll(".ch"), scenes = p.querySelectorAll("[data-scene]"), pp = p.querySelector("[data-pp]");
  var DUR = 5200, cur = 0, timer = null, paused = reduce, left = DUR, started = 0;
  // stagger overlay pieces
  scenes.forEach(function (s) {
    var parts = s.querySelectorAll(".phone, .msg, .pick, .mate, .box, .total, .mail");
    var order = Array.prototype.slice.call(parts);
    if (s.classList.contains("s3")) order = order.filter(function (e) { return e.classList.contains("box"); }).reverse().concat(order.filter(function (e) { return !e.classList.contains("box"); }));
    order.forEach(function (el, k) { el.classList.add("anim"); el.style.animationDelay = (0.15 + k * 0.28) + "s"; });
  });
  p.style.setProperty("--dur", DUR + "ms");
  function show(n) {
    cur = (n + scenes.length) % scenes.length;
    scenes.forEach(function (s, k) { s.classList.toggle("on", k === cur); });
    chs.forEach(function (c, k) { c.classList.remove("on"); c.setAttribute("aria-selected", k === cur ? "true" : "false"); });
    void chs[cur].offsetWidth; chs[cur].classList.add("on");
    if (window.innerWidth <= 860) chs[cur].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    left = DUR; schedule();
  }
  function schedule() { clearTimeout(timer); if (paused) return; started = Date.now(); timer = setTimeout(function () { show(cur + 1); }, left); }
  chs.forEach(function (c, k) { c.addEventListener("click", function () { show(k); }); });
  pp.addEventListener("click", function () {
    paused = !paused; p.classList.toggle("paused", paused);
    pp.textContent = paused ? "▶" : "❚❚"; pp.setAttribute("aria-label", paused ? "Play" : "Pause");
    if (paused) { clearTimeout(timer); left = Math.max(300, left - (Date.now() - started)); } else schedule();
  });
  if (reduce) { p.classList.add("paused"); pp.textContent = "▶"; }
  // only run when visible
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) clearTimeout(timer); else if (!paused) schedule(); }); }, { threshold: .3 });
    io.observe(p);
  }
  show(0);
})();

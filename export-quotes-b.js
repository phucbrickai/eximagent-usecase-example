(function () {
  var pins = document.querySelectorAll("[data-pin]"), pi = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function cycle() { pins.forEach(function (p, k) { p.classList.toggle("on", k === pi % pins.length); }); pi++; }
  if (pins.length) { cycle(); if (!reduce) setInterval(cycle, 2200); }
  pins.forEach(function (p) { p.addEventListener("click", function () { pins.forEach(function (q) { q.classList.toggle("on", q === p); }); }); });

  var track = document.querySelector("[data-track]");
  if (track) {
    var cards = track.querySelectorAll(".stn"), dots = document.querySelectorAll(".m-dots i");
    var term = document.querySelector("[data-mterm]"), price = document.querySelector("[data-mprice]");
    var prev = document.querySelector("[data-prev]"), next = document.querySelector("[data-next]");
    var cur = -1;
    function set(n) {
      if (n === cur) return; cur = n;
      term.textContent = cards[n].dataset.term;
      price.textContent = cards[n].dataset.price || "…";
      dots.forEach(function (d, k) { d.classList.toggle("on", k <= n); });
      prev.disabled = n === 0; next.disabled = n === cards.length - 1;
    }
    function nearest() {
      var x = track.scrollLeft, best = 0, bd = 1e9;
      cards.forEach(function (c, k) { var d = Math.abs(c.offsetLeft - track.offsetLeft - x); if (d < bd) { bd = d; best = k; } });
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = cards.length - 1;
      set(best);
    }
    function go(n) { n = Math.max(0, Math.min(cards.length - 1, n)); track.scrollTo({ left: cards[n].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" }); set(n); }
    track.addEventListener("scroll", function () { window.requestAnimationFrame(nearest); }, { passive: true });
    prev.addEventListener("click", function () { go(cur - 1); });
    next.addEventListener("click", function () { go(cur + 1); });
    track.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { go(cur + 1); e.preventDefault(); } if (e.key === "ArrowLeft") { go(cur - 1); e.preventDefault(); } });
    set(0);
  }
  var send = document.querySelector("[data-send]");
  if (send) send.addEventListener("click", function () { send.textContent = "Sent ✓ · reminder set for 22 Nov"; send.classList.add("sent"); send.disabled = true; });
})();

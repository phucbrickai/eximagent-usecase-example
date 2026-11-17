(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Hero: link each RFQ phrase to the quote line it became */
  var art = document.querySelector("[data-pair-cycle]");
  if (art) {
    var keys = ["prod", "qty", "term", "pay", "ship"], i = 0, timer;
    function show(k) {
      art.querySelectorAll("[data-k]").forEach(function (el) { el.classList.toggle("on", el.getAttribute("data-k") === k); });
    }
    function tick() { show(keys[i % keys.length]); i++; }
    art.querySelectorAll("[data-k]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { clearInterval(timer); show(el.getAttribute("data-k")); });
    });
    if (reduce) show("term"); else { tick(); timer = setInterval(tick, 1800); }
  }

  /* Build the price: scroll steps fill the costing sheet */
  var build = document.querySelector("[data-build]");
  if (build) {
    var steps = build.querySelectorAll(".bstep");
    var rows = build.querySelectorAll(".ladder-rows li, .buyer-check");
    var segs = build.querySelectorAll(".ladder-bar i");
    var totalEl = build.querySelector("[data-total]");
    var termEl = build.querySelector("[data-term]");
    var MT = 19.2;
    var STATE = [
      [0, "Buyer clear, waiting for costs"],
      [88489.46, "Goods cost"],
      [93146.80, "EXW Buon Ma Thuot"],
      [93902.90, "FOB Cat Lai"],
      [96052.90, "CFR Hamburg"],
      [96211.65, "CIF Hamburg"],
      [5012.00 * MT, "Quoted, CIF Hamburg"]
    ];
    var current = -1, shown = 0;
    function fmt(n) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    function animateTo(target) {
      if (reduce) { totalEl.textContent = fmt(target); shown = target; return; }
      var from = shown, t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - p, 3);
        shown = from + (target - from) * e;
        totalEl.textContent = fmt(shown);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function setStep(n) {
      if (n === current) return;
      current = n;
      steps.forEach(function (s, k) { s.classList.toggle("is-active", k === n); });
      rows.forEach(function (r) {
        var at = +r.getAttribute("data-show");
        r.classList.toggle("shown", at <= n);
        r.classList.toggle("fresh", at === n);
      });
      segs.forEach(function (g) { g.classList.toggle("on", +g.getAttribute("data-seg") <= n); });
      termEl.textContent = STATE[n][1];
      animateTo(STATE[n][0] / MT);
    }
    function onScroll() {
      var mid = window.innerHeight * (window.innerWidth <= 760 ? 0.62 : 0.5), best = 0;
      steps.forEach(function (s, k) { if (s.getBoundingClientRect().top < mid) best = k; });
      setStep(best);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* Incoterm switch */
  var terms = document.querySelector("[data-terms]");
  if (terms) {
    var T = {
      EXW: [0, "EXW Buon Ma Thuot", "4,852", "The buyer collects from your warehouse."],
      FCA: [1, "FCA Cat Lai terminal", "4,882", "You hand the container over at the Cat Lai terminal."],
      FOB: [2, "FOB Cat Lai", "4,891", "You pay until the coffee is on board."],
      CFR: [3, "CFR Hamburg", "5,003", "You also pay the sea freight to Hamburg."],
      CIF: [5, "CIF Hamburg", "5,012", "You also insure the cargo to Hamburg."]
    };
    var route = terms.querySelector(".route");
    var legs = route.querySelectorAll(".leg"), stops = route.querySelectorAll(".stop");
    var btns = terms.querySelectorAll("[data-term]");
    function pick(code) {
      var d = T[code], lvl = d[0], legsPaid = Math.min(lvl, 3);
      btns.forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-term") === code ? "true" : "false"); });
      route.setAttribute("data-level", lvl);
      legs.forEach(function (l, k) { l.classList.toggle("paid", k < legsPaid); });
      stops.forEach(function (s, k) { s.classList.toggle("reach", k <= legsPaid); });
      terms.querySelector("[data-term-name]").textContent = d[1];
      terms.querySelector("[data-term-price]").textContent = d[2];
      terms.querySelector("[data-term-line]").textContent = d[3];
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () { pick(b.getAttribute("data-term")); });
      b.addEventListener("keydown", function (e) {
        var list = Array.prototype.slice.call(btns), k = list.indexOf(b);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var nb = list[(k + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
          nb.focus(); pick(nb.getAttribute("data-term")); e.preventDefault();
        }
      });
    });
    pick("CIF");
  }

  /* Draft: open attachments, press send */
  document.querySelectorAll("[data-open]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = document.getElementById(b.getAttribute("data-open"));
      if (d && d.showModal) d.showModal();
    });
  });
  document.querySelectorAll("dialog.doc").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });
  var send = document.querySelector("[data-send]");
  if (send) {
    send.addEventListener("click", function () {
      var draft = send.closest(".draft");
      draft.classList.add("is-sent");
      send.textContent = "Sent ✓";
      send.disabled = true;
      draft.querySelector("[data-sent]").hidden = false;
    });
  }
})();

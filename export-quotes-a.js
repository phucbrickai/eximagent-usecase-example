(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tpl]"));
  var img = document.querySelector("[data-vimg]"), vname = document.querySelector("[data-vname]"), vroute = document.querySelector("[data-vroute]");
  var stage = document.querySelector(".lib-stage");
  var cur = 0;
  function pick(n, push) {
    cur = (n + cards.length) % cards.length;
    var c = cards[cur], slug = c.getAttribute("data-tpl");
    cards.forEach(function (x, k) { x.setAttribute("aria-pressed", k === cur ? "true" : "false"); });
    vname.textContent = c.getAttribute("data-name");
    vroute.textContent = c.getAttribute("data-route");
    var src = "images/xq/tpl-" + slug + ".webp";
    if (img.getAttribute("src") !== src) {
      img.classList.add("fading");
      var pre = new Image();
      pre.onload = function () { img.src = src; img.alt = c.getAttribute("data-name").replace(" · ", " quotation in the ") + " style."; img.classList.remove("fading"); };
      pre.src = src;
    }
    if (stage) stage.scrollTop = 0;
    if (push) history.replaceState(null, "", "?template=" + slug);
  }
  cards.forEach(function (c, k) { c.addEventListener("click", function () { pick(k, true); }); });
  var lp = document.querySelector("[data-lprev]"), ln = document.querySelector("[data-lnext]");
  if (lp) lp.addEventListener("click", function () { pick(cur - 1, true); });
  if (ln) ln.addEventListener("click", function () { pick(cur + 1, true); });
  var q = new URLSearchParams(location.search).get("template");
  var start = 0;
  cards.forEach(function (c, k) { if (c.getAttribute("data-tpl") === q) start = k; });
  if (cards.length) pick(start, false);
  // preload the rest after load
  window.addEventListener("load", function () { cards.forEach(function (c) { var i = new Image(); i.src = "images/xq/tpl-" + c.getAttribute("data-tpl") + ".webp"; }); });

  var send = document.querySelector("[data-send]");
  if (send) send.addEventListener("click", function () { send.textContent = "Sent ✓ · reminder set for 22 Nov"; send.classList.add("sent"); send.disabled = true; });
})();

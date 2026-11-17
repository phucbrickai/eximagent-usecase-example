(function () {
  var wrap = document.querySelector("[data-aterms]");
  if (wrap) {
    var tiles = wrap.querySelectorAll(".aterm");
    function pick(n) {
      tiles.forEach(function (t, k) { t.classList.toggle("out", k > n); t.classList.toggle("cur", k === n); t.setAttribute("aria-pressed", k === n ? "true" : "false"); });
    }
    tiles.forEach(function (t, k) { t.addEventListener("click", function () { pick(k); }); });
    pick(4);
  }
  var send = document.querySelector("[data-send]");
  if (send) send.addEventListener("click", function () { send.textContent = "Sent ✓ · reminder set for 22 Nov"; send.classList.add("sent"); send.disabled = true; });
})();

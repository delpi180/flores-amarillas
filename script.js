(function () {
  var LOADER_MS = 3000;
  var EXIT_FIRST_MS = 780;

  var loader = document.getElementById("loader");
  var main = document.getElementById("main");
  var btnReveal = document.getElementById("btnReveal");
  var extraReveal = document.getElementById("extraReveal");
  var firstBlock = document.getElementById("firstBlock");
  var bitsCanvas = document.getElementById("bitsCanvas");

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Fondo: columnas de bits 0/1 (estilo matrix ligero) */
  function initBitsCanvas() {
    if (!bitsCanvas || prefersReducedMotion()) return;

    var ctx = bitsCanvas.getContext("2d");
    if (!ctx) return;

    var fontSize = 13;
    var columns = 0;
    var drops = [];
    var bg = "rgba(10, 14, 18, 0.12)";

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      bitsCanvas.width = w;
      bitsCanvas.height = h;
      columns = Math.max(1, Math.floor(w / fontSize));
      drops = [];
      var i;
      for (i = 0; i < columns; i++) {
        drops[i] = Math.random() * (h / fontSize);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    function tick() {
      var w = bitsCanvas.width;
      var h = bitsCanvas.height;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.font = "500 " + fontSize + 'px "JetBrains Mono", ui-monospace, monospace';
      var i;
      for (i = 0; i < columns; i++) {
        var ch = Math.random() > 0.52 ? "1" : "0";
        var x = i * fontSize;
        var y = drops[i] * fontSize;
        var flicker = 0.12 + Math.random() * 0.22;
        ctx.fillStyle = "rgba(45, 212, 191, " + flicker + ")";
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.55 + Math.random() * 0.35;
        }
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  initBitsCanvas();

  if (!loader || !main) return;

  window.setTimeout(function () {
    loader.classList.add("is-hidden");
    main.classList.add("is-visible");
    loader.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "false");
  }, LOADER_MS);

  if (btnReveal && extraReveal) {
    btnReveal.addEventListener("click", function () {
      btnReveal.setAttribute("disabled", "disabled");
      main.classList.add("main--second-step");
      if (firstBlock) {
        void firstBlock.offsetHeight;
        firstBlock.classList.add("main__first--exit");
      }
      btnReveal.classList.add("is-hidden");
      btnReveal.setAttribute("aria-expanded", "true");

      var waitFirstExit = prefersReducedMotion() ? 50 : EXIT_FIRST_MS;

      window.setTimeout(function () {
        extraReveal.removeAttribute("hidden");
        void extraReveal.offsetHeight;
        extraReveal.classList.add("is-visible");
        extraReveal.setAttribute("aria-hidden", "false");
      }, waitFirstExit);
    });
  }
})();

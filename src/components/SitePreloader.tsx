/** Ранний брендированный прелоадер до полной загрузки страницы */
export function SitePreloader() {
  const hideScript = `
(function () {
  var el = document.getElementById("site-preloader");
  if (!el) return;
  var done = false;
  function hide() {
    if (done) return;
    done = true;
    el.classList.add("site-preloader--hide");
    window.setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 450);
  }
  if (document.readyState === "complete") {
    window.setTimeout(hide, 180);
  } else {
    window.addEventListener("load", function () {
      window.setTimeout(hide, 180);
    });
  }
  window.setTimeout(hide, 9000);
})();
`;

  return (
    <>
      <div
        id="site-preloader"
        className="site-preloader"
        aria-live="polite"
        aria-busy="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(180deg, #27105c 0%, #2a1268 42%, #12072c 100%)",
          color: "#fff",
        }}
      >
        <div className="site-preloader__glow" aria-hidden />
        <div className="site-preloader__card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="site-preloader__icon"
            src="/favicon-32x32.png"
            width={48}
            height={48}
            alt=""
          />
          <p className="site-preloader__brand">ГЕРОФАРМ</p>
          <p className="site-preloader__caption">Загружаем викторину…</p>
          <div className="site-preloader__spinner" aria-hidden />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: hideScript }} />
    </>
  );
}

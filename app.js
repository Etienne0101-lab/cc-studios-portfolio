(function () {
  "use strict";

  var data = window.WORKS;
  var gallery = document.getElementById("gallery");
  var filtersEl = document.getElementById("filters");
  var activeFilter = "all";
  var visibleWorks = [];

  function cardHTML(work) {
    return (
      '<article class="card" tabindex="0" data-slug="' + work.slug + '">' +
        '<img src="' + work.slug + '.jpg" alt="' + escapeHTML(work.title) + '" loading="lazy">' +
        '<div class="card-body">' +
          '<div class="medium">' + escapeHTML(work.medium) + '</div>' +
          '<h2>' + escapeHTML(work.title) + '</h2>' +
          '<p class="note">' + escapeHTML(work.note) + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderFilters() {
    var html = '<button type="button" data-filter="all" aria-pressed="true">All work</button>';
    data.collections.forEach(function (col) {
      html += '<button type="button" data-filter="' + col.id + '" aria-pressed="false">' +
        escapeHTML(col.title) + '</button>';
    });
    filtersEl.innerHTML = html;
    filtersEl.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      setFilter(btn.getAttribute("data-filter"));
    });
  }

  function setFilter(id) {
    activeFilter = id;
    filtersEl.querySelectorAll("button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filter") === id ? "true" : "false");
    });
    renderGallery();
  }

  function renderGallery() {
    visibleWorks = [];
    var html = "";
    data.collections.forEach(function (col) {
      if (activeFilter !== "all" && col.id !== activeFilter) return;
      if (activeFilter === "all") {
        html += '<h2 class="collection-heading">' + escapeHTML(col.title) + '</h2>';
      }
      col.works.forEach(function (work) {
        visibleWorks.push(work);
        html += cardHTML(work);
      });
    });
    gallery.innerHTML = html;
  }

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbTitle = document.getElementById("lbTitle");
  var lbMeta = document.getElementById("lbMeta");
  var currentIndex = -1;

  function openLightbox(slug) {
    var idx = visibleWorks.findIndex(function (w) { return w.slug === slug; });
    if (idx < 0) return;
    currentIndex = idx;
    showCurrent();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  }

  function showCurrent() {
    var work = visibleWorks[currentIndex];
    lbImg.src = work.slug + ".jpg";
    lbImg.alt = work.title;
    lbTitle.textContent = work.title;
    lbMeta.textContent = work.medium + " · " + work.note;
  }

  function step(dir) {
    if (!visibleWorks.length) return;
    currentIndex = (currentIndex + dir + visibleWorks.length) % visibleWorks.length;
    showCurrent();
  }

  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }

  gallery.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (card) openLightbox(card.getAttribute("data-slug"));
  });

  gallery.addEventListener("keydown", function (e) {
    var card = e.target.closest(".card");
    if (card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openLightbox(card.getAttribute("data-slug"));
    }
  });

  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
  document.getElementById("lbNext").addEventListener("click", function () { step(1); });

  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });

  renderFilters();
  renderGallery();
})();

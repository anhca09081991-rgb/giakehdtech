// Renders content from /data/*.json so non-technical staff can edit
// images, prices and titles via the /admin CMS without touching HTML.

var CATEGORY_LABELS = {
  "trung-bay": "Kệ trưng bày",
  "sieu-thi": "Kệ siêu thị",
  "kho": "Kệ kho"
};

function loadJson(url, onSuccess, onError) {
  if (typeof fetch === "function") {
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(onSuccess)
      .catch(onError);
    return;
  }
  // Fallback for older engines without fetch()
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try { onSuccess(JSON.parse(xhr.responseText)); }
        catch (e) { onError(e); }
      } else {
        onError(new Error("HTTP " + xhr.status));
      }
    }
  };
  xhr.send();
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function productCardHtml(item) {
  var label = CATEGORY_LABELS[item.category] || "Sản phẩm";
  var imgBlock = item.image
    ? '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '">'
    : '<span class="ring-mark" style="--size:64px;"></span>';
  var imgWrapStyle = item.image ? "" : ' style="display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg, var(--charcoal-2), var(--black));"';
  return (
    '<div class="product-card" data-cat="' + item.category + '">' +
      '<div class="img-wrap"' + imgWrapStyle + '>' + imgBlock + '</div>' +
      '<div class="body">' +
        '<div class="tag">' + label + '</div>' +
        '<h4>' + escapeHtml(item.title) + '</h4>' +
        '<div class="meta"><span class="price">' + escapeHtml(item.price || "Liên hệ báo giá") + '</span>' +
        '<a href="contact.html">Yêu cầu báo giá →</a></div>' +
      '</div>' +
    '</div>'
  );
}

function renderProductGrid() {
  var grid = document.getElementById("product-grid");
  if (!grid) return;
  loadJson("data/products.json", function (data) {
    var html = (data.items || []).map(productCardHtml).join("");
    grid.innerHTML = html;
    initFilterBar();
  }, function (err) { console.error("Không tải được data/products.json", err); });
}

function initFilterBar() {
  var chips = document.querySelectorAll(".filter-chip");
  var cards = document.querySelectorAll(".product-card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var cat = chip.getAttribute("data-cat");
      cards.forEach(function (card) {
        card.style.display = (cat === "all" || card.getAttribute("data-cat") === cat) ? "" : "none";
      });
    });
  });
}

function categoryCardHtml(cat) {
  return (
    '<div class="cat-card">' +
      '<div class="img-wrap"><img src="' + cat.image + '" alt="' + escapeHtml(cat.title) + '"></div>' +
      '<div class="body">' +
        '<div class="num">' + escapeHtml(cat.num) + '</div>' +
        '<h3>' + escapeHtml(cat.title) + '</h3>' +
        '<p>' + escapeHtml(cat.desc) + '</p>' +
        '<a class="link" href="' + cat.link + '">Xem mẫu →</a>' +
      '</div>' +
    '</div>'
  );
}

function renderHome() {
  var heroBg = document.getElementById("hero-bg");
  var catGrid = document.getElementById("category-grid");
  if (!heroBg && !catGrid) return;
  loadJson("data/home.json", function (data) {
    if (heroBg && data.hero_image) {
      heroBg.style.backgroundImage = "url('" + data.hero_image + "')";
    }
    if (catGrid && data.categories) {
      catGrid.innerHTML = data.categories.map(categoryCardHtml).join("");
    }
  }, function (err) { console.error("Không tải được data/home.json", err); });
}

document.addEventListener("DOMContentLoaded", function () {
  renderProductGrid();
  renderHome();
});

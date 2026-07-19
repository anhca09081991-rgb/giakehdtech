document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  var closeBtn = document.querySelector('.mobile-drawer .close');

  if (toggle && drawer) {
    toggle.addEventListener('click', function () { drawer.classList.add('open'); });
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', function () { drawer.classList.remove('open'); });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) drawer.classList.remove('open');
    });
  }

  // Contact form (no backend — build a mailto link)
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var need = form.need.value;
      var msg = form.message.value.trim();
      var body = 'Ho ten: ' + name + '%0D%0ASDT: ' + phone + '%0D%0ANhu cau: ' + need + '%0D%0ANoi dung: ' + msg;
      window.location.href = 'mailto:contact@giakehdtech.vn?subject=Lien he tu website&body=' + body;
    });
  }
});

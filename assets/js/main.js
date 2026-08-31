// MAV Solar — comportamiento compartido en todas las páginas

document.addEventListener("DOMContentLoaded", function () {
  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
      });
    });
  }

  // Envío de formularios vía Web3Forms (sin backend propio)
  // TODO(MAV Solar): reemplazar WEB3FORMS_ACCESS_KEY_AQUI por su Access Key real
  // Se obtiene gratis en https://web3forms.com/ con el correo de la empresa.
  var forms = document.querySelectorAll("form[data-web3forms]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var statusEl = form.querySelector(".form-status");
      var submitBtn = form.querySelector('button[type="submit"]');
      var formData = new FormData(form);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.dataset.originalText || submitBtn.textContent;
        submitBtn.textContent = "Enviando...";
      }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (statusEl) {
            statusEl.classList.remove("is-error");
            statusEl.classList.add("is-visible");
            if (data.success) {
              statusEl.classList.add("is-ok");
              statusEl.textContent = "¡Listo! Recibimos tu solicitud, te contactaremos en menos de 5 minutos hábiles.";
              form.reset();
            } else {
              statusEl.classList.add("is-error");
              statusEl.textContent = "No se pudo enviar. Escríbenos directo por WhatsApp con el botón verde.";
            }
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.classList.add("is-visible", "is-error");
            statusEl.textContent = "Hubo un problema de conexión. Intenta de nuevo o usa WhatsApp.";
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText;
          }
        });
    });
  });
});

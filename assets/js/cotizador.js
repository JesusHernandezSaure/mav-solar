// MAV Solar — Cotizador preliminar
// Modelo de estimación basado en rangos de mercado reportados en el estudio
// interno de mercado (León, Gto. 2026). No sustituye un estudio de
// ingeniería ni una visita técnica: sirve para calificar y orientar al
// prospecto antes de agendar una auditoría.

(function () {
  var TARIFAS = {
    tarifa1: {
      label: "Tarifa 1 (doméstica subsidiada)",
      precioKwh: 1.2,
      viable: false,
    },
    dac: {
      label: "DAC (doméstica de alto consumo)",
      precioKwh: 6.2,
      viable: true,
      kwpMin: 2.2,
      kwpMax: 11,
    },
    pdbt: {
      label: "PDBT (comercial, < 25 kW)",
      precioKwh: 4.0,
      viable: true,
      kwpMin: 3,
      kwpMax: 30,
    },
    gdmt: {
      label: "GDMTO / GDMTH (industrial, media tensión)",
      precioKwh: 3.6,
      viable: true,
      kwpMin: 30,
      kwpMax: 500,
      esIndustrial: true,
    },
  };

  var HSP = 5.5; // horas solares pico promedio región León
  var PERFORMANCE_RATIO = 0.78; // pérdidas típicas del sistema
  var OFFSET = 0.85; // % del consumo que el sistema busca cubrir

  var PRECIO_W_MIN = 15; // MXN por watt instalado
  var PRECIO_W_MAX = 28;

  function formatMXN(n) {
    return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  }

  function renderEmpty(container) {
    container.innerHTML = '<p class="result-empty">Completa el formulario para ver tu estimación de sistema, inversión y retorno.</p>';
  }

  function renderNoViable(container) {
    container.innerHTML =
      '<h3>Tarifa 1 detectada</h3>' +
      '<p class="result-empty">Con subsidio vigente y consumo bajo, la energía cuesta cerca de $1.20 MXN/kWh: el retorno de una instalación solar normalmente se estira más de una década. Con este nivel de consumo será difícil que te propongamos una cotización.</p>' +
      '<p class="result-empty">Si tu consumo ha crecido o te reclasificaron a DAC, vuelve a cotizar con esa tarifa, o escríbenos y lo revisamos juntos.</p>';
  }

  function renderIndustrialNote(container, data) {
    container.innerHTML =
      '<h3>Estimación preliminar — Industrial</h3>' +
      '<div class="result-row"><span>Sistema estimado</span><strong>' + data.kwp.toFixed(1) + ' kWp</strong></div>' +
      '<div class="result-row"><span>Inversión de referencia</span><strong>' + formatMXN(data.investLow) + ' – ' + formatMXN(data.investHigh) + '</strong></div>' +
      '<div class="result-row"><span>Deducción fiscal (Art. 34 LISR)</span><strong>100% en el primer ejercicio</strong></div>' +
      '<p class="result-empty" style="margin-top:14px;">En tarifas GDMTO/GDMTH el cargo por demanda, el horario punta y el Código de Red cambian el dimensionamiento. Esta cifra es solo un punto de partida — no considera almacenamiento (BESS) ni el estudio eléctrico obligatorio. Agenda tu diagnóstico gratuito para una propuesta real.</p>';
  }

  function renderResult(container, data) {
    container.innerHTML =
      '<h3>Tu estimación preliminar</h3>' +
      '<div class="result-value">' + data.kwp.toFixed(1) + ' kWp</div>' +
      '<p class="result-empty" style="margin:0 0 10px;">Tamaño de sistema sugerido</p>' +
      '<div class="result-row"><span>Inversión estimada</span><strong>' + formatMXN(data.investLow) + ' – ' + formatMXN(data.investHigh) + '</strong></div>' +
      '<div class="result-row"><span>Ahorro anual aproximado</span><strong>' + formatMXN(data.ahorroAnual) + '</strong></div>' +
      '<div class="result-row"><span>Retorno de inversión</span><strong>' + data.paybackLow.toFixed(1) + ' – ' + data.paybackHigh.toFixed(1) + ' años</strong></div>' +
      '<p class="result-empty" style="margin-top:14px;">Estimación con precios de referencia de la región ($' + PRECIO_W_MIN + '–$' + PRECIO_W_MAX + ' MXN/W instalado). No sustituye una propuesta técnica formal.</p>';
  }

  function calcular(form, resultBox) {
    var tarifaKey = form.tarifa.value;
    var recibo = parseFloat(form.recibo.value);

    if (!tarifaKey || !recibo || recibo <= 0) {
      renderEmpty(resultBox);
      return;
    }

    var tarifa = TARIFAS[tarifaKey];

    if (!tarifa.viable) {
      renderNoViable(resultBox);
      return;
    }

    var monthlyKwh = recibo / tarifa.precioKwh;
    var dailyKwhTarget = (monthlyKwh * OFFSET) / 30;
    var kwp = dailyKwhTarget / (HSP * PERFORMANCE_RATIO);

    // Ajuste a rangos típicos del segmento
    if (kwp < tarifa.kwpMin) kwp = tarifa.kwpMin;
    if (kwp > tarifa.kwpMax) kwp = tarifa.kwpMax;

    var investLow = kwp * 1000 * PRECIO_W_MIN;
    var investHigh = kwp * 1000 * PRECIO_W_MAX;
    var ahorroAnual = recibo * 12 * OFFSET;
    var paybackLow = investLow / ahorroAnual;
    var paybackHigh = investHigh / ahorroAnual;

    var data = {
      kwp: kwp,
      investLow: investLow,
      investHigh: investHigh,
      ahorroAnual: ahorroAnual,
      paybackLow: paybackLow,
      paybackHigh: paybackHigh,
    };

    if (tarifa.esIndustrial) {
      renderIndustrialNote(resultBox, data);
    } else {
      renderResult(resultBox, data);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("cotizador-form");
    var resultBox = document.getElementById("cotizador-resultado");
    if (!form || !resultBox) return;

    renderEmpty(resultBox);

    form.addEventListener("input", function () {
      calcular(form, resultBox);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // El envío del lead (nombre/contacto) ocurre en el formulario de contacto;
      // aquí solo recalculamos y guiamos al siguiente paso.
      calcular(form, resultBox);
      var cta = document.getElementById("cotizador-cta");
      if (cta) cta.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
})();

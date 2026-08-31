# MAV Solar

Sitio web institucional de MAV Solar (León, Guanajuato): ingeniería eléctrica
industrial aplicada a energía solar y almacenamiento. Es un sitio **HTML,
CSS y JS puros** (sin framework ni backend propio) para poder alojarse en
cualquier hosting estático de forma gratuita.

El contenido y la estrategia de posicionamiento ("no vendemos paneles
solares, somos ingenieros eléctricos industriales resolviendo problemas
energéticos") están basados en el estudio de mercado y la propuesta de
marketing interna de MAV Solar (2026).

## Estructura

```
index.html          Inicio: posicionamiento, segmentos, prueba social
servicios.html       Auditoría, industrial, comercial, residencial DAC
instalaciones.html   Galería de casos con filtro por segmento
cotizador.html        Calculadora de sistema / inversión / retorno
contacto.html         Calendario, WhatsApp y formulario de contacto
assets/css/styles.css Estilos (paleta tomada del logo)
assets/js/main.js     Menú móvil + envío de formularios (Web3Forms)
assets/js/cotizador.js Lógica del cotizador (100% en el navegador)
assets/img/           Logo y favicon
```

## Herramientas externas usadas (todas con capa gratuita)

El sitio es estático, así que las acciones que requieren "backend" se
delegan a servicios de terceros mediante scripts o `<iframe>`. Antes de
publicar, hay que completar estos pendientes (buscar `TODO(MAV Solar)` en
el código):

| Herramienta | Para qué | Dónde se configura |
|---|---|---|
| **Web3Forms** | Recibir el formulario de `contacto.html` por correo, sin servidor propio. | Crear cuenta gratis en https://web3forms.com/, copiar el *Access Key* y reemplazar `WEB3FORMS_ACCESS_KEY_AQUI` en `contacto.html`. |
| **Calendly** | Que el prospecto agende directamente su auditoría. | Crear cuenta gratis en https://calendly.com/, y reemplazar la URL de ejemplo del `<iframe>` en `contacto.html` (`https://calendly.com/mav-solar/auditoria-gratuita`) por la real. |
| **WhatsApp (click-to-chat)** | Botón flotante y CTAs de WhatsApp en todas las páginas. | Reemplazar `524770000000` por el número real de WhatsApp Business en formato `52` + 10 dígitos, en todas las páginas (buscar `wa.me`). |
| **Tidio** (opcional, recomendado) | Chat con respuestas automáticas dentro del sitio, con opción de conectarlo a WhatsApp más adelante. | Crear cuenta gratis en https://www.tidio.com/, pegar el script que genera en el bloque `TODO(MAV Solar): activar el chat automatizado` antes de `</body>` en cada página. |

### Por qué este stack

- **Formulario → Web3Forms** en vez de Netlify Forms: funciona igual en
  GitHub Pages, Netlify o cualquier hosting estático, sin atarse a un
  proveedor de hosting específico.
- **Citas → Calendly**: evita construir un sistema de agenda propio;
  plan gratuito cubre un único tipo de evento (suficiente para "auditoría
  gratuita").
- **Chat → WhatsApp click-to-chat + Tidio**: WhatsApp cubre el canal que
  la estrategia de marketing identifica como crítico (respuesta en menos
  de 5 minutos); Tidio añade un chat en el sitio con respuestas
  automáticas configurables sin costo para volúmenes iniciales.
- **Cotizador → JavaScript en el navegador**: es solo aritmética con los
  rangos de mercado del estudio (MXN/W, tarifas CFE), así que no necesita
  ningún servicio externo ni costo recurrente.

## Contenido pendiente de reemplazar

Buscar en el código los textos entre corchetes (`[TELÉFONO]`,
`[PLACEHOLDER]`, etc.) y sustituirlos por datos reales de MAV Solar:
teléfono, correo, fotos de instalaciones y casos con cifras verificadas
(kWp instalados, kWh generados, mes de recuperación). Estas fotos y casos
son el contenido de mayor autoridad para diferenciarse de la competencia
local, según el estudio de mercado.

## Publicar el sitio (gratis)

**Opción recomendada: GitHub Pages**
1. En GitHub, ir a *Settings → Pages* del repositorio.
2. Elegir la rama a publicar (por ejemplo `main`) y la carpeta raíz (`/`).
3. GitHub genera una URL pública del tipo `https://usuario.github.io/mav-solar/`.

**Alternativa: Netlify**
1. Conectar el repositorio de GitHub en https://app.netlify.com/.
2. Build command: (ninguno). Publish directory: `/`.
3. Netlify da una URL gratuita y HTTPS automático.

No se requiere build ni dependencias: es HTML servido tal cual.

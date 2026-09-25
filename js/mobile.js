// QR Contacto - compatibilidad móvil
// Capacitor carga este mismo sitio dentro de Android/iOS.
// Se mantienen las APIs web de cámara y geolocalización para
// que el proyecto siga funcionando también en GitHub Pages.
(function () {
  if (window.Capacitor) {
    document.documentElement.classList.add("capacitor-app");
  }
})();

// config.js
var siteConfig = {
    icon: "Avatar1-small.ico",
    title: "My GitHub Pages"
};

// Auto-carga de la configuración en todas las páginas
(function () {
    var scriptElement = document.createElement("script");
    scriptElement.src = "config.js";
    document.head.appendChild(scriptElement);
})();
$(document).ready(function () {
    $(".card-project").hover(
        function () {
            $(this).find('.carousel-caption').addClass('active'); // Añade clase para mostrar el caption
            $(this).find('.imagen-filtrada').addClass('active'); // Añade clase para mantener el efecto del <svg>
        },
        function () {
            $(this).find('.carousel-caption').removeClass('active'); // Quita clase para ocultar el caption
            $(this).find('.imagen-filtrada').removeClass('active'); // Quita clase para desactivar el efecto del <svg>
        }
    );
});
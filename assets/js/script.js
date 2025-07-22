$(document).ready(function() {
    // URL del endpoint de la API de FastAPI para Primarcas
    const API_URL = "http://127.0.0.1:8000/primarcas";

    // Función para crear una tarjeta de Primarca
    function createPrimarchCard(primarch, index) {
        // Mapear la lealtad para las clases CSS y el texto mostrado
        const loyaltyClass = primarch.lealtad.toLowerCase() === 'leal' ? 'loyal' : 'traitor';
        const loyaltyText = primarch.lealtad;

        // Se corrige el posible error de "hhttps" en la URL de la imagen
        const imageUrl = primarch.url_imagen.replace(/^hhttps:\/\//, 'https://');
        // Si la URL de la imagen está vacía, usar un placeholder
        const finalImageUrl = imageUrl || 'https://placehold.co/400x450/0f0f0f/b3b3b3?text=Desconocido';


        // Generar la lista de hechos importantes para la parte trasera
        const hechosImportantesList = primarch.hechos_importantes.map(fact => `<li>${fact}</li>`).join('');

        return `
            <div class="flip-card loading-animation" style="animation-delay: ${index * 0.1}s">
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <div class="primarch-image-container" style="background-image: url('${finalImageUrl}');">
                            <div class="loyalty-badge ${loyaltyClass}">${loyaltyText}</div>
                            <div class="primarch-name-overlay">
                                <div class="primarch-name">${primarch.nombre}</div>
                                <div class="legion-info">${primarch.legion}</div>
                            </div>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <div class="primarch-details">
                            <h3>${primarch.nombre}</h3>
                            <p><strong>Planeta de Origen:</strong> ${primarch.planeta_origen}</p>
                            <p><strong>Estado:</strong> ${primarch.estado}</p>
                            <p><strong>Lealtad:</strong> ${primarch.lealtad}</p>
                            <p><strong>Especialidad:</strong> ${primarch.especialidad}</p>
                            <p><strong>Arma Característica:</strong> ${primarch.arma_caracteristica}</p>
                            <p><strong>Hechos Importantes:</strong></p>
                            <ul>
                                ${hechosImportantesList}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Realizar la llamada GET al endpoint de FastAPI para obtener los datos de los Primarcas
    $.getJSON(API_URL, function(primarchsData) {
        // Si la llamada es exitosa, iteramos sobre los datos recibidos
        // y generamos las tarjetas dinámicamente
        if (primarchsData && primarchsData.length > 0) {
            primarchsData.forEach((primarch, index) => {
                $('#primarchs-container').append(createPrimarchCard(primarch, index));
            });
        } else {
            $('#primarchs-container').html('<p>No se encontraron datos de Primarcas.</p>');
        }

        // Efectos adicionales para las tarjetas generadas dinámicamente
        // Estos manejadores de eventos aseguran que las tarjetas giren al pasar el ratón
        $('.flip-card').on('mouseenter', function() {
            $(this).find('.flip-card-inner').addClass('hovered');
        }).on('mouseleave', function() {
            $(this).find('.flip-card-inner').removeClass('hovered');
        });

        // Habilitar el desplazamiento suave para una mejor experiencia de usuario
        $('html').css('scroll-behavior', 'smooth');

    }).fail(function(jqxhr, textStatus, error) {
        // Manejo de errores en caso de que la llamada a la API falle
        const err = textStatus + ", " + error;
        console.error("Error al cargar los Primarcas desde la API: " + err);
        $('#primarchs-container').html('<p>No se pudieron cargar los datos de los Primarcas. Asegúrate de que la API de FastAPI esté en ejecución en ' + API_URL + ' y que el archivo `data.json` sea accesible.</p>');
    });
});
